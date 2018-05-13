<?php
namespace PhilTurner\StripePay\Gateway\Config;

class Config extends \Magento\Payment\Gateway\Config\Config
{
    const CODE = 'stripepay';
    const KEY_MODE = 'test_mode';
    const KEY_ACTIVE = 'active';
    const KEY_TEST_PUBLISHABLE = 'test_publishable';
    const KEY_TEST_SECRET = 'test_secret';


    public function isActive()
    {
        return (bool)$this->getValue(self::KEY_ACTIVE);
    }

    public function isTestMode()
    {
        return (bool)$this->getValue(self::KEY_MODE);
    }

    public function getSecretKey()
    {
        if ($this->isTestMode()) {
            return $this->getValue(self::KEY_TEST_SECRET);
        }
    }

    public function getPublishableKey()
    {
        if ($this->isTestMode()) {
            return $this->getValue(self::KEY_TEST_PUBLISHABLE);
        }
    }
}

