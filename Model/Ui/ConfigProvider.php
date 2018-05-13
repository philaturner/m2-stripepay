<?php
namespace PhilTurner\StripePay\Model\Ui;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use PhilTurner\StripePay\Gateway\Config\Config;

class ConfigProvider implements \Magento\Checkout\Model\ConfigProviderInterface
{
    protected $config;

    public function __construct(
        ScopeConfigInterface $configInterface
    ) {
        $this->config = $configInterface;
    }

    public function getConfig()
    {
        return [
            'payment' => [
                Config::CODE => [
                    'publishableKey' => $this->getPublishableKey(),
                ],
            ],
        ];
    }

    public function getPublishableKey()
    {
        if ($this->isTestMode()) {
            return $this->config->getValue(('payment/' . Config::CODE . '/' . Config::KEY_TEST_PUBLISHABLE), ScopeInterface::SCOPE_STORE);
        }
        //TODO return live key when implemented
    }

    protected function isTestMode()
    {
        return (int)$this->config->getValue(('payment/' . Config::CODE . '/' . Config::KEY_MODE), ScopeInterface::SCOPE_STORE);
    }

}
