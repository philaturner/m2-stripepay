<?php
namespace PhilTurner\StripePay\Console\Command;

use PhilTurner\StripePay\Test\Api\Capture;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;

class Run extends Command
{

    /**
     * @var Capture
     */
    protected $capture;

    public function __construct(
        Capture $capture
    ) {
        $this->capture = $capture;
        parent::__construct();
    }

    protected function configure()
    {
        $this->setName('stripe:testapi:capture');
        $this->setDescription('Run a test capture through Stripe integration');
        $this->addArgument('api-key', InputArgument::REQUIRED);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('Running test capture');
        $this->capture->run($input->getArgument('api-key'));
        $output->writeln('Test finished');
    }
}

