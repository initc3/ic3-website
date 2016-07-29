<?php include 'includes/header.php' ?>

<?php
$challenges = array(
    1 => array(
        'title' => 'Scaling and Performance',
        'text' => 'Scaling up blockchains to handle intensive global workloads for both permissionless decentralized blockchains, and permissioned/consortium blockchains supporting &gt;100,000 transactions/sec.',
        'color' => 'brown',
    ),
    2 => array(
        'title' => 'Correctness by Design and Construction',
        'text' => 'Making it easy, and even automatic, for blockchain developers to produce secure protocols and code, by utilizing (1) programming language techniques to create correct code, and (2) cryptographic protocols with security proofs.',
        'color' => 'blue'
    ),
    3 => array(
        'title' => 'Confidentiality',
        'text' => 'Combining transparency with confidentiality in blockchains, by utilizing (1) cryptographic techniques, as well as (2) trusted-hardware.',
        'color' => 'green'
    ),
    4 => array(
        'title' => 'Authenticated Data Feeds',
        'text' => 'Supporting a robust ecosystem of trustworthy data feeds for blockchains and contributing high-trust data feed solutions.',
        'color' => 'olive'
    ),
    5 => array(
        'title' => 'Safety and Compliance',
        'text' => 'Enabling techniques and protocols for effective monitoring and targeted intervention in blockchains, informed by evaluations of traditional contract law and risks of crime in smart contracts.',
        'color' => 'violet'
    ));


function project_item($title, $tags, $desc) {
    global $challenges;
    $meta = "Supports Grand Challenge: ";
    foreach ($tags as $t) {
        $meta .= ("<div class='ui " . $challenges[$t]['color'] . " label'>" . $challenges[$t]['title'] . "</div>");
    }
    echo "<div class=\"item\">
    <div class=\"content\">
        <div class=\"header\">$title</div>
        <div class=\"meta\">$meta</div>
        <div class=\"description\">
            <button class=\"ui compact basic icon mini showmore button\">
                Read On<i class=\"double angle down icon\"></i>
            </button>
            <p class=\"more\"> $desc 
                <button class=\"ui compact basic mini showless icon button\">
                    Show Less<i class=\"double angle up icon\"></i>
                </button>
            </p>
        </div>
    </div>
    </div>";
}
?>

<h1 class="ui header">The Five Grand Challenges</h1>

IC3 has several projects underway to address what we identify as five “Grand Challenges” to widespread blockchain adoption.

<?php

echo '<ul>';

foreach ($challenges as $c) {
    echo "<li><div class='ui " . $c["color"] . " label'>" . $c["title"] . "</div>: " . $c['text'] . "</li>";
}

echo '</ul>';

?>

<div class="ui info message">
The five Grand Challenges outlined above serve as a motivation and a project map for the following IC3 projects.
</div>

<h1>Projects</h1>



<?php

?>


<div class="ui divided items">
    <?php
    project_item(
        "Solidus: A Centralized Future for Cryptocurrencies?",
        array(1,3),
        "Solidus is a cryptocurrency (&quot;blockchain&quot;) that can be run by a confederation or consortium of trustworthy entities-- -banks, governments, auditors, etc. While it retains some of the benefits of decentralization, Solidus offers higher performance and tighter governance and control than existing cryptocurrencies such as Bitcoin. Many successful peer-to- peer technologies have historically been eclipsed or supplanted by centralized or commercial systems (e.g., in the online music industry). Solidus addresses the possibility and desire by many financial institutions that cryptocurrencies and contracts will follow a similar path. For more info, please see the Solidus presentation at our <a href=\"http://www.initc3.org/sched\">2016 IC3 Retreat</a> in NYC.");

    project_item(
        "Bitcoin-NG: A Next-generation Blockchain Protocol",
        array(1),
        "Bitcoin-NG is a new protocol pioneered by IC3. It addresses the scalability bottleneck of Bitcoin by enabling the Bitcoin network to achieve the highest throughput allowed by the network conditions. Paradoxically, not only does it improve transaction throughput, it also reduces transaction latencies -- it is possible to get an initial transaction confirmation in seconds rather than in minutes. And it does so without changing Bitcoin’s open architecture and trust model. Our blockchain test bed Miniature World simulated Bitcoin-NG at 15% the size of the operational Bitcoin system, where we showed that Bitcoin–NG is only limited by the network. For more info, please see our <a href=\"http://arxiv.org/abs/1510.02037\">paper</a>.");

    project_item(
        "Miniature World: A Test Bed for Simulating Real World Blockchain",
        array(1),
        "Miniature World is a large blockchain emulation test bed at Cornell University consisting of ~1000 nodes. This test bed enables us to run experiments on different blockchains, and a variety of use cases, using realistic internet latencies to evaluate real world scenarios (as referenced above for Bitcoin-NG). We make Miniature World available for our Industry Sponsors to evaluate various block chains and their use cases. For more info about becoming an IC3 Industry Sponsor, please see <a href=\"http://www.initc3.org/partners\">http://www.initc3.org/partners</a>.");

    project_item(
        "Fruitchain: A new Approach for Incentive Compatible Blockchains",
        array(1),
        "Most of today’s blockchains, such as Bitcoin, are not “incentive compatible”, meaning they are quite vulnerable to strategic gaming by dishonest adversaries. For example, IC3 has proven that the Bitcoin blockchain can be compromised by miners or mining pools with much less than 50% of the mining hash power. Fruitchain is an innovative blockchain methodology that discourages dishonest gaming, by making it extremely unprofitable for an adversary with less than 50% of the hash power, achieving an epsilon-equilibrium or near-Nash equilibrium. For more info, please see the Fruitchain presentation by IC3 co-director Professor Elaine Shi at our <a href=\"http://www.initc3.org/sched\">2016 IC3 Retreat</a> in NYC.");

    project_item(
        "Falcon Network: A High-Performance, Wide Area Interconnect for Blockchains",
        array(1),
        "The Falcon Network achieves gains over current approaches through minimal validation and cut-through routing. No special software is required on clients, and it is fundamentally faster than all other known techniques. For more info, please see <a href=\"http://www.falcon-net.org\">http://www.falcon-net.org</a>."
    );

    project_item(
        "FLAC: A Calculus for Flow-Limited Authorization",
        array(2),
        "                Real-world applications routinely make authorization decisions based on dynamic computation. Integrity of the system might be compromised if attackers can improperly influence the authorizing computation. Confidentiality can also be compromised by authorization, since authorization decisions are often based on sensitive data such as membership lists and passwords. Flow-Limited Authorization Calculus (FLAC) is both a simple, expressive model for reasoning about dynamic authorization and also a language for securely implementing various authorization mechanisms. FLAC provides strong end-to- end information security guarantees even for programs that incorporate and implement rich dynamic authorization mechanisms. For more info, please see the presentation by Professor Andrew Myers “Verifying Information Security of Code in Dynamic Systems” at our <a href=\"http://www.initc3.org/sched\">2016 IC3 Retreat</a> in NYC."
    );

    project_item(
        "Theoretical Foundations for Secure Decentralized Systems",
        array(2),
        "                This work explores the theoretical basis for the security and stability of open decentralized systems. The benefits of decentralization include resistance to many kinds of attacks, diversity, and diffusion of power. The novelty and inspiring success of Bitcoin has provided new evidence that secure decentralized systems are more feasible than once thought. On the other hand, even Bitcoin risks becoming centralized if thrown off-balance, e.g. due to mining pools, ASIC farms, or political schisms. Furthermore, IC3 and collaborators just released a research paper that analyzed The Digital Autonomous Organization (DAO) and its voting mechanism. This paper identifies problems with The DAO&#39;s mechanism design that incentivize investors to behave strategically; that is, at odds with truthful voting on their preferences. We then outline potential attacks against The DAO made possible by these behaviors. For more info, please see <a href=\"http://hackingdistributed.com/2016/05/27/dao-call-for-moratorium\">http://hackingdistributed.com/2016/05/27/dao-call-for-moratorium</a>."
    );

    project_item(
        "Hawk: Privacy-Preserving Blockchain &amp; Smart Contracts",
        array(2, 3),
        "Existing blockchain-based cryptocurrencies such as Bitcoin and Ethereum store all financial transactions in the clear on the blockchain. This compromises the privacy of financial transactions, which is essential in numerous applications. Hawk is a blockchain-based smart contract system that stores encrypted transactions on the blockchain, and relies on cryptography to retain the security of the cryptocurrency. For more info, please see <a href=\"http://oblivm.com/hawk\">http://oblivm.com/hawk</a>."
    );

    project_item(
        "Town Crier: Authenticated Data Feeds for Smart Contracts",
        array(3, 4),
        "In order to reason about the real world, smart contracts in cryptocurrency systems will rely on informational input from what we call authenticated data feeds (ADFs); such information can include stock prices, meteorological reports, news, and other current events. It is therefore important that an ADF be trustworthy, in the sense of providing security against manipulation by an attacker attempting to influence the outcome of a contract. By utilizing trusted hardware to provide reliable, digitally signed attestations on data to client contracts, the Town Crier system can serve as a trustworthy ADF under minimal trust assumptions about its operator. For further details, please see our <a href=\"http://www.initc3.org/files/tc.pdf\">paper</a>."
    );

    project_item(
        "Virtual Notary: A Free and Secure Electronic Attestation Service",
        array(4),
        "Virtual Notary is a service for attesting to online factoids. Virtual Notary issues both freestanding certificates as well as immutable records on the Bitcoin blockchain. It has been operational for more than 3 years, and certified more than 600,000 factoids. For more info, please see <a href=\"http://virtual-notary.org\">http://virtual-notary.org</a>."
    );

    project_item(
        "EtherScrape: A Complementary Block Explorer for the Ethereum Blockchain",
        array(4),
        "Smart Contracts in Ethereum are written in a high-level programming language (typically Serpent or Solidity) and then compiled down to bytecode for the Ethereum virtual machine. This compilation step removes a lot of the useful information found in the high level source code, such as comments, names of variables, etc. If you can identify the high-level source code for a contract, you have a better chance of figuring out what it does. EtherScrape uses fingerprinting to match each smart contract on the blockchain (that is, the compiled bytecode) to the high-level source code that created it. For more info, please see <a href=\"http://etherscrape.com\">http://etherscrape.com</a>."
    );

    project_item(
        "Gyges: Crime in Decentralized Smart Contracts ",
        array(5),
        "Two of the most widely desired goals for &quot;Bitcoin 2.0&quot; are privacy and more expressive smart contracts. Many uses of cryptocurrency have a clear and legitimate need for privacy (e.g., financial service companies are expected to protect the privacy of their clients&#39; transactions). General purpose smart contract programming frameworks make it easy to tinker, prototype, and search for the next &quot;killer application&quot; for cryptocurrencies. These two directions seem to be at odds with each other; however, through the use of sophisticated cryptography (like zero knowledge proofs and multi-party computation), we explore how to achieve both goals at once. For further details, please see our paper at <a href=\"http://www.initc3.org/files/Gyges.pdf\">http://www.initc3.org/files/Gyges.pdf</a>."
    )
    ?>
</div>


<?php include 'includes/footer.php' ?>
