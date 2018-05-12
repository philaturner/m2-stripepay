define(
    [
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/model/quote',
        'jquery',
        'Magento_Checkout/js/model/full-screen-loader',
        'Magento_Payment/js/model/credit-card-validation/validator',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Checkout/js/action/place-order',
        'Magento_Checkout/js/action/redirect-on-success',
        'https://js.stripe.com/v3/'
    ],
    function (Component, quote, $, screenLoader, validator, additionalValidators, placeOrderAction, redirectOnSuccess){
        'use strict';

        return Component.extend({
            defaults: {
                template: 'PhilTurner_StripePay/payment/stripepay',
                stripe: null,
                stripeCardElement: null,
                stripeCard: null,
                stripeToken: null
            },

            placeOrder: function(data, event){
                let self = this;
                let defer;

                if (event) event.preventDefault();

                //disable button and start loader
                this.isPlaceOrderActionAllowed(false);
                screenLoader.startLoader();

                //get billing info from quote
                let stripeAddressData = this.getBillingData();

                //try get stripe token
                defer = this.setStripeToken(stripeAddressData);

                $.when(defer).done(function(result) {
                    //TODO remove logging
                    console.log(self.stripeToken);
                    self.actionOrder();
                }).fail(function(result) {
                    screenLoader.stopLoader();
                    self.isPlaceOrderActionAllowed(true);
                    self.messageContainer.addErrorMessage({
                        'message': result
                    });
                });
                return true;
            },

            actionOrder: function() {
                let self = this;
                let placeOrder = placeOrderAction(self.getData(), self.messageContainer);

                $.when(placeOrder).done(function() {
                    if (self.redirectAfterPlaceOrder) {
                        redirectOnSuccess.execute();
                    }
                }).fail(function(response) {
                    //TODO remove logging
                    console.log(response.error);
                    screenLoader.stopLoader();
                    self.isPlaceOrderActionAllowed(true);
                });
            },

            initialize: function(){
                this._super();
                //TODO use get method to get key from config
                this.stripe = Stripe('pk_test_LhdtmRoQafJFa6LeAq19Bt1P');
            },

            initStripe: function() {
                let self = this;

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

            },

            setStripeToken: function(customerAddress){
                let self = this;
                let defer = $.Deferred();

                self.stripe.createToken(self.stripeCard, customerAddress).then(function(result) {
                    if (result.error) {
                        defer.reject(result.error.message);
                    }else {
                        self.stripeToken = result.token;
                        defer.resolve({});
                    }
                });

                return defer.promise()
            },

            getBillingData: function(){
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
            },

            getCode: function(){
                return 'stripepay';
            }
        });
    }
);