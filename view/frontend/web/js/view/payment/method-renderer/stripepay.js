define(
    [
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/model/quote'
    ],
    function (Component, quote) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'PhilTurner_StripePay/payment/stripepay'
            },

            placeOrder: function(data, event) {
                let stripeAddressData = this.getBillingData();
                console.log(stripeAddressData);
                return false;
            },

            getBillingData: function () {
                let billingAddress = quote.billingAddress();

                let stripeAddressData = {
                    name: billingAddress.firstname + ' ' + billingAddress.lastname,
                    address_country: billingAddress.countryId,
                    address_line1: billingAddress.street[0]
                };

                if (billingAddress.street.length === 2) stripeAddressData.address_line2 = billingAddress.street[1];

                if (billingAddress.hasOwnProperty('postcode')) stripeAddressData.address_zip = billingAddress.postcode;

                if (billingAddress.hasOwnProperty('regionCode')) stripeAddressData.address_state = billingAddress.regionCode;

                if (!stripeAddressData.address_state) stripeAddressData.address_state = '';

                return stripeAddressData;
            }
        });
    }
);