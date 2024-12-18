
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DASHBOARD, MERCHANTS, MESSAGES, PRODUCTS, SETTINGS, STORES } from './admin.constants';

export const ADMIN_ROUTES: Routes = [
    { path: '', redirectTo: DASHBOARD, pathMatch: 'full'},
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: DASHBOARD,
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: STORES,
                loadComponent: () => import('./stores/stores.component').then(m => m.StoresComponent)
            },
            {
                path: MERCHANTS,
                loadComponent: () => import('./merchants/merchants.component').then(m => m.MerchantsComponent)
            },
            {
                path: PRODUCTS,
                loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent)
            },
            {
                path: MESSAGES,
                loadComponent: () => import('./messages/messages.component').then(m => m.MessagesComponent)
            },
            {
                path: SETTINGS,
                loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
            },
        ]
    }
];