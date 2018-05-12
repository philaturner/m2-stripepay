define(
    [
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/model/quote',
        'https://js.stripe.com/v3/'
    ],
    function (Component, quote) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'PhilTurner_StripePay/payment/stripepay',
                stripe: null,
                stripeCardElement: null,
                stripeCard: null
            },

            placeOrder: function(data, event) {
                let stripeAddressData = this.getBillingData();
                console.log(stripeAddressData);
                return false;
            },

            initialize: function() {
                this._super();
                //TODO use get method to get key from config
                this.stripe = Stripe('pk_test_LhdtmRoQafJFa6LeAq19Bt1P');
            },

            initStripe: function() {
                var self = this;

                let style = {
                    base: {
                        color: '#32325d',
                        lineHeight: '22px',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '22px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    },
                    hidePostalCode: true
                };

                self.stripeCardElement = self.stripe.elements();
                self.stripeCard = self.stripeCardElement.create('card', { style: style });
                self.stripeCard.mount('#stripe-card');

                // self.stripeCard.addEventListener('change', function(event) {
                //     var displayError = document.getElementById('card-errors');
                //     if (event.error) {
                //         displayError.textContent = event.error.message;
                //     } else {
                //         displayError.textContent = '';
                //     }
                // });
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