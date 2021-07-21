from bson import json_util, ObjectId
from . import utils
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
import jwt
import datetime
from django.http import JsonResponse

products = settings.PRODUCTS
users = settings.USERS
secret_key = settings.SECRET_KEY

def parse_json(data):
    return json.loads(json_util.dumps(data))

def createToken(emailID):
    token = jwt.encode(
        {"emailID": emailID,
         "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=24 * 60 * 60)
        },
        secret_key,
        algorithm="HS256")
    return token

@csrf_exempt
def product(request):
    if request.method == "GET":
        str = request.GET.get("$oid")
        product = products.find_one({"_id": ObjectId(str)})
        return JsonResponse(parse_json(product))
        
@csrf_exempt
def sections(request):
    if request.method == "GET":
        sections = []
        for product in products.find({}):
            if product["section"] not in sections:
                sections.append(product["section"])
        return JsonResponse({"sections": sections})

@ csrf_exempt
def profile_details(request):
    if request.method == "POST":
        posted_obj = json.loads(request.body)
        emailID = posted_obj["emailID"]
        firstName = posted_obj["firstName"]
        mobileNumber = posted_obj["mobileNumber"]
        users.update_one({"emailID": emailID}, {"$set": {"firstName": firstName, "mobileNumber": mobileNumber}})
        return JsonResponse({"success": "You're profile details have been successfully updated!"})

@csrf_exempt
def login(request):
    if request.method == "POST":
        posted_obj = json.loads(request.body)
        emailID = posted_obj["emailID"]
        password = posted_obj["password"]
        user = users.find_one({"emailID": emailID})
        if not user:
            return JsonResponse({"error": "There's no user associated with this Email ID!"})
        if not check_password(password, user["password"]):
            return JsonResponse({"error": "You've entered an incorrect password!"})
        return JsonResponse({"token": createToken(emailID), "user": parse_json(user), "success": "You've successfully logged in!"})

@csrf_exempt
def landing_products(request):
    if request.method == "GET":
        sections = []
        categories = []
        for product in products.find({}):
            if product["section"] not in sections:
                sections.append(product["section"])
            if product["category"] not in categories:
                categories.append(product["category"])
        landing_products = []
        for section in sections:
            for category in categories:
                for product in products.find({"section": section, "category": category}).limit(2):
                    landing_products.append(product)
        return JsonResponse({"products": parse_json(landing_products)})

@csrf_exempt
def create_account(request):
    if request.method == "POST":
        posted_obj = json.loads(request.body)
        emailID = posted_obj["emailID"]
        mobileNumber = posted_obj["mobileNumber"]
        if users.find_one({"emailID": emailID, "mobileNumber": mobileNumber}):
            return JsonResponse({"error": "A user with this Email ID and Mobile number already exists!"})
        if users.find_one({"emailID": emailID}):
            return JsonResponse({"error": "A user with this Email ID already exists!"})
        if users.find_one({"mobileNumber": mobileNumber}):
            return JsonResponse({"error": "A user with this Mobile number already exists!"})
        posted_obj["password"] = make_password(posted_obj["password"])
        posted_obj["cartDetails"] = []
        posted_obj["orderHistory"] = []
        users.insert_one(posted_obj)
        return JsonResponse({"success": "Your account has been successfully created!", "token": createToken(emailID)})

@csrf_exempt
def listing_products(request):
    if request.method == "GET":
        section = request.GET.get("section")
        category = request.GET.get("category")
        new_category = request.GET.get("newCategory")
        categories = []
        for product in products.find({"section": section}):
            if product["category"] not in categories:
                categories.append(product["category"])
        def modify_categories(str):
            categories.remove(str)
            categories.insert(0, str)
        if new_category:
            listing_products = products.find({"section": section, "category": new_category})
            modify_categories(new_category)
        else:
            if category == "null":
                listing_products = products.find({"section": section, "category": categories[0]})
            else:
                listing_products = products.find({"section": section, "category": category})
                modify_categories(category)
        return JsonResponse({"products": parse_json(listing_products), "categories": categories})

@utils.requireLogin
@csrf_exempt
def order_history(request):
    if request.method == "GET":
        email_id = request.GET.get("emailID")
        order_history = users.find_one({"emailID": email_id})["orderHistory"]
        if order_history == []:
            return JsonResponse({"empty": " "})
        order_history.reverse()
        return JsonResponse({"orders": parse_json(order_history)})
    if request.method == "POST":
        posted_obj = json.loads(request.body)
        email_id = posted_obj["emailID"]
        cart_products = posted_obj["cartProducts"]
        order_history = users.find_one({"emailID": email_id})["orderHistory"]
        cart_products.reverse()
        for cart_product in cart_products:
            str = cart_product["_id"]["$oid"]
            del cart_product["_id"]
            cart_product["oid"] = str
            order_history.append(cart_product)
            qtyLeft = products.find_one({"_id": ObjectId(str)})["qtyLeft"]
            qtyLeft[cart_product["size"]] -= cart_product["qty"]
            products.update_one({"_id": ObjectId(str)}, {"$set": {"qtyLeft": qtyLeft}})
        users.update_one({"emailID": email_id}, {"$set": {"orderHistory": order_history, "cartDetails": []}})
        if len(cart_products) == 1:
            text = "order has"
        else:
            text = "orders have"
        return JsonResponse({"success": f"Your {text} been successfully placed!"})

@utils.requireLogin
@csrf_exempt
def cart_details(request):
    if request.method == "GET":
        email_id = request.GET.get("emailID")
        cartDetails = users.find_one({"emailID": email_id})["cartDetails"]
        if cartDetails == []:
            return JsonResponse({"empty": " "})
        cart_products = []
        for cart_product in cartDetails:
            product = products.find_one({"_id": ObjectId(cart_product["oid"])})
            product["size"] = cart_product["size"]
            product["qty"] = cart_product["qty"]
            cart_products.insert(0, product)
        return JsonResponse({"products": parse_json(cart_products)})
    if request.method == "POST":
        posted_obj = json.loads(request.body)
        email_id = posted_obj["emailID"]
        str = posted_obj["$oid"]
        size = posted_obj["size"]
        cart_details = users.find_one({"emailID": email_id})["cartDetails"]
        if cart_details == []:
            cart_details.append({"oid": str, "size": size, "qty": 1})
        else:
            for cart_product in cart_details:
                if ((cart_product["oid"] == str) and (cart_product["size"] == size)):
                    qtyLeft = products.find_one({"_id": ObjectId(str)})["qtyLeft"][size]
                    if (cart_product["qty"] < qtyLeft):
                        cart_product["qty"] += 1
                        cart_details.remove(cart_product)
                        cart_details.append(cart_product)
                        users.update_one({"emailID": email_id}, {"$set": {"cartDetails": cart_details}})
                        return JsonResponse({"success": "Product has been successfully added to your cart!"})
                    return JsonResponse({"error": f"Can't add more, only {qtyLeft} left in stock!"})
            cart_details.append({"oid": str, "size": size, "qty": 1})
        users.update_one({"emailID": email_id}, {"$set": {"cartDetails": cart_details}})
        return JsonResponse({"success": "Product has been successfully added to your cart!"})
    if request.method == "PATCH":
        posted_obj = json.loads(request.body)
        email_id = posted_obj["emailID"]
        str = posted_obj["$oid"]
        size = posted_obj["size"]
        qty = posted_obj["qty"]
        cart_details = users.find_one({"emailID": email_id})["cartDetails"]
        for cart_product in cart_details:
            if (cart_product["oid"] == str) and (cart_product["size"] == size):
                cart_product["qty"] = qty
        users.update_one({"emailID": email_id}, {"$set": {"cartDetails": cart_details}})
        return JsonResponse({"success": ""})
    if request.method == "DELETE":
        email_id = request.GET.get("emailID")
        str = request.GET.get("$oid")
        size = request.GET.get("size")
        cart_details = users.find_one({"emailID": email_id})["cartDetails"]
        for cart_product in cart_details:
            if (cart_product["oid"] == str) and (cart_product["size"] == size):
                cart_details.remove(cart_product)
        users.update_one({"emailID": email_id}, {"$set": {"cartDetails": cart_details}})
        return JsonResponse({"success": ""})