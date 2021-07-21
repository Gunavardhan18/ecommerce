import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';

const routes: Routes = [
  {path: "", redirectTo: "landing", pathMatch: "full"},
  {path: "landing", component: LandingComponent},
  {path: "login", component: LoginComponent},
  {path: "createAccount", component: CreateAccountComponent},
  {path: "orderHistory", component: OrderHistoryComponent, canActivate: [AuthGuard]},
  {path: "productListing/:section", component: ProductListingComponent},
  {path: "productDetail/:$oid", component: ProductDetailComponent},
  {path: "profileDetails", component: ProfileDetailsComponent},
  {path: "cartDetails", component: CartDetailsComponent, canActivate: [AuthGuard]},
  {path: "**", component: LandingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
