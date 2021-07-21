"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

# prepend the urls with "api/" for use in production mode
urlpatterns = [
    path('admin/', admin.site.urls),
    path("product/", views.product, name="product func"),
    path("sections/", views.sections, name="sections func"),
    path("profileDetails/", views.profile_details, name="profile_details func"),
    path("login/", views.login, name="login func"),
    path("landingProducts/", views.landing_products, name="landing_products func"),
    path("createAccount/", views.create_account, name="create_account func"),
    path("listingProducts/", views.listing_products, name="listing_products func"),
    path("orderHistory/", views.order_history, name="order_history func"),
    path("cartDetails/", views.cart_details, name="cart_details func"), 
]
