import { Routes } from "@angular/router";
import { MerchantComponent } from "./merchant.component";
import { DASHBOARD, MESSAGES, PRODUCTS, SETTINGS, STORE } from "./merchant.constants";
// import { authGuard } from "../../auth/auth.guard";


export const MERCHANT_ROUTES: Routes = [

    { path: '', redirectTo: DASHBOARD, pathMatch: 'full' },
    {
        path: '',
        component: MerchantComponent,
        children: [
            {
                path: DASHBOARD,
                loadComponent: () => import('./merchant-dashboard/merchant-dashboard.component').then(m => m.MerchantDashboardComponent)
            },
            {
                path: STORE,
                loadComponent: () => import('./merchant-stores/merchant-store.component').then(m => m.MerchantStoreComponent)
            },
            {
                path: PRODUCTS,
                loadComponent: () => import('./merchant-products/merchant-products.component').then(m => m.MerchantProductsComponent)
            },
            {
                path: MESSAGES,
                loadComponent: () => import('./merchant-messages/merchant-messages.component').then(m => m.MerchantMessagesComponent)
            },
            {
                path: SETTINGS,
                loadComponent: () => import('./merchant-settings/merchant-settings.component').then(m => m.MerchantSettingsComponent)
            }
        ]
    }
]
