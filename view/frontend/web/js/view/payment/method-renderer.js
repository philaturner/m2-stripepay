define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],
    function (
        Component,
        rendererList
    ) {
        'use strict';
        rendererList.push(
            {
                type: 'stripepay',
                component: 'PhilTurner_StripePay/js/view/payment/method-renderer/stripepay'
            }
        );
        return Component.extend({});
    }
);