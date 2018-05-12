<?php
namespace PhilTurner\StripePay\Test\Api;

use Stripe\Customer;
use Stripe\Stripe;
use Stripe\Charge;
use Stripe\Refund;

class Capture
{

    public function run($arg)
    {
        $value = 2000;
        $id = uniqid();
        $secretKey = $arg;
        $curr = 'USD';

        echo "Getting credentials \n";
        echo "Key: $secretKey \n";
        echo "Test Capture ID: $id \n";
        echo "Currency: $curr \n";
        echo "Value: $value \n";

        Stripe::setApiKey($secretKey);

        try {
            $charge = Charge::create(array(
                "amount" => $value,
                "currency" => $curr,
                "source" => "tok_visa", // obtained with Stripe.js
                "description" => "Charge for $id"
            ));
        } catch (\Stripe\Error\Card $e) {
            return $e;
        }

        echo "Charge ID: " . $charge['id'] . "\n";
        echo "Captured: " . $charge['captured'] . "\n";
        echo "Description: " . $charge['description'] . "\n";

        return $charge['status'];
    }
}

