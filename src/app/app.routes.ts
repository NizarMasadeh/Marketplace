import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { authMerchantGuard } from './pages/merchant/auth-merchant.guard';
import { authAdminGuard } from './pages/admin/authAdmin/auth-admin.guard';
import { LoginComponent } from './pages/login/login.component';
// import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home', component: HomeComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'merchant-register',
                loadComponent: () => import('./pages/merchant-register/merchant-register.component').then(m => m.MerchantRegisterComponent)
            },
            {
                path: 'merchant-profile-register',
                loadComponent: () => import('./pages/merchant-register/merchant-profile-register/merchant-profile-register.component').then(m => m.MerchantProfileRegisterComponent)
            },
        ]
    },
    {
        path: 'merchant',
        loadChildren: () => import('./pages/merchant/merchant.routes').then(m => m.MERCHANT_ROUTES),
        canActivate: [authMerchantGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [authAdminGuard]

    },
    {
        path: 'not-auth',
        loadComponent: () => import('./pages/error/notauth/notauth.component').then(m => m.NotauthComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/error/error.component').then(m => m.ErrorComponent)
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }