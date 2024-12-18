import { trigger, transition, style, animate } from '@angular/animations';

export const fadeOut = trigger('fadeOut', [
    transition('* => *', [
        style({ opacity: 1 }),
        animate('450ms', style({ opacity: 0 })),
    ]),
]);