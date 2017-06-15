---
name: 'IC3-Ethereum Crypto Boot Camp at Cornell University'
subtitle: Registration is Open for Experienced Developers. Collaborate to Advance Blockchain Applications.
location: Gates Hall, Cornell University. Ithaca, New York
start: 2017-07-13
end: 2017-07-19
summary: IC3 and the Ethereum Foundation will conduct our second annual Boot Camp, an immersive coding and learning experience in blockchains and smart contracts with world-leading researchers, open source developers, and students. Collaborate to Advance Blockchain Applications.
tags:
  - featured
---

IC3 and the Ethereum Foundation are Conducting our Second Immersive Weeklong Coding and Learning Experience in Blockchains and Smart Contracts with World-leading Professors, Open Source Developers and Students. [See a summary of the 2016 Boot Camp here](http://www.initc3.org/events/2016-07-20-IC3-Ethereum-Crypto-Boot-Camp-and-Workshop-at-Cornell-University.html).

- Work as a member of a dev team on a weeklong project, led by a blockchain expert.
- Attend daily keynote presentations by smart contract and blockchain experts.

**Who should attend?**  Experienced full-time blockchain developers who want to learn, contribute and advance blockchain solutions.  

## NOTABLE ATTENDEES (CONFIRMED)

- Ethereum Foundation (Vitalik Buterin, Chief Scientist, Ming Chan Executive Director)
- IC3 Directors (Ittay Eyal, Ari Juels, Andrew Miller and Elaine Shi)
- Ethereum researchers (Alex Van de Sande, Casey Detrio, Vlad Zamfir, Alex Beregszaszi, Loi Luu, Chang-Wu Chen, Yoichi Hirai)


## PROJECTS (please check back later for updates)

### 1) Distributed Key Generation for HoneyBadger BFT

Team leader: Andrew Miller

Implement and demo a Distributed Key Generation (DKG) procedure for setting up threshold signature / threshold encryption keys among N parties.


[Honey Badger BFT](https://github.com/amiller/honeyBadgerBFT/), as well as many other applications, rely on threshold signatures and threshold encryption. Threshold cryptography requires distributed *shares* of a key to each of N nodes, one share per node. Right now, the HoneyBadger demo cheats, and does this by use of a “trusted dealer” who learns all the private keys. Clearly this isn’t desirable.


Instead, we know of Distributed Key Generation (DKG) protocols, which let the group of parties generate and distribute shares for themselves. Note that this is more complicated than just establishing a list of public keys, since the threshold cryptography relies on the keys being related by a mathematical relationship.

### 2) Town Crier Applications

Team leader: Ethan Cecchetti

Town Crier is an “Oracle” service based on trusted hardware. It uses trusted hardware (Intel SGX) to provide a verifiable log of an HTTPs communication. It can provide a short, on-chain proof that a certain website (identified by its HTTPs certificate) actually delivered a message of a particular form at a particular time.


The TC public Ethereum blockchain service was launched on 15 May. Visit [www.town-crier.org](www.town-crier.org) for details and background.

### 3) White-Hat Blockchain Hacks
Team leader: Ari Juels

Several important blockchain services appear to have serious vulnerabilities. They include:


- Storj: Lack of innate erasure coding appears to make this service vulnerable to DoS attacks. The erasure-coding scheme they propose to deploy won’t fix the problem. They punt the problem to users. See “Hostage Bytes” (Section 5.4) in their paper. How easy or hard is it for users to protect themselves?

- Oraclize: Allows arbitrary code execution with its new “computation” query type. This would seem to open up vulnerabilities such as Gyges password-resale attacks.  

 
The goal of this project is to investigate such vulnerabilities.

### 4) Sleepy + Thunderella Implementation
Team leader:  Elaine Shi

Thunderella, Thunderella, night and day it’s Thunderella. Commit transactions, make a block, process inputs, round the clock. Thunderella!


1.	Implement a simple but provably secure blockchain protocol without proof-of-work
2.	Create possibly multiple implementations of the protocol in Ruby/Python/Rust/Go
3.	Implement Thunderella on top that allows for (optimistic) instant confirmation


### 5) Offline Payment Channels with SGX
Team leader: Ittay Eyal

Using Trusted Execution Environments (TEEs) one can achieve point-to-point payments and payment routing over multiple hops chained together, all without monitoring the blockchain. An ongoing project, TEEChain, achieves this for Bitcoin using Intel’s SGX technology for the TEE. The goal of this project is to implement TEEChain for Ethereum. Beyond protocol design optimized for Ethereum scripts, the protocol requires SGX programming, in particular implementing transaction generation inside SGX.


Some details are already available on a simplified version of TEEChain, called TEEChan.
See the [blog post](http://hackingdistributed.com/2016/12/22/scaling-bitcoin-with-secure-hardware/)
and the [workshop paper](https://arxiv.org/abs/1612.07766).
 
### 6) Writing Secure Smart Contracts

Team leader: Phil Daian

Implement non-trivial secure smart contracts leveraging cutting edge ecosystem techniques and featuring a unique attack/defend challenge.


The art of writing secure smart contracts is a growing challenge facing the Ethereum ecosystem today.  With several recent major high profile smart contract failures and losses, the need for a thorough and practically useful methodology for securing the development of these contracts is paramount.

 
In this project, team members will be split up individually or into small groups.  They will be provided with a specification of a nontrivial and useful smart contract to be deployed on the Ethereum main network.  The specification will intentionally open challenges of secure software development.  In the first phase, team members implement this contract.

 
In the second phase of the project, the full source code of all deployed contracts will be made public, and project members will work together to complete full security audits for each of the contracts.  Project members will be encouraged to deploy attacks and exploits to try to cause denial of service and user funds loss issues on the testnet contracts.  We will supply several vulnerable contracts for users to attack.

 
Overall, the goal of this project is to increase our understanding of secure smart contract development by exposing its challenges in a lab setting, while providing team members with knowledge on how to attack and defend smart contracts.  These sample contracts will also be used in researching a new process framework for developing secure smart contracts, called the Hydra framework. The Hydra framework is a novel application of n-version programming to smart contract security and bug bounty management, whose efficacy will be put to the test by this experiment!

 
Ideally, we will use the Hydra framework combine the output of all team members in this bootcamp to create the most secure contract ever deployed on ETH mainnet, with our final contract being vulnerable to compromise only if all of the subcontracts developed in the boot camp are too.

## FUN ACTIVITIES

“Ithaca is Gorges”.  To relax and clear our heads from time to time, we are planning periodic group excursions to local gorges, parks, lakes and points of interest.

## REGISTRATION and SPONSORSHIP

**STUDENTS**: We are offering free access for a limited number of well-qualified full-time students enrolled at the IC3 campuses (Berkeley, Cornell, Cornell Tech, UIUC, and the Technion); please [apply here](https://docs.google.com/forms/d/e/1FAIpQLSfBq37rmPlBS0k8zuRwa8DltVYq7RcpkdOT15vPOd80HmR2aQ/viewform).

**INDUSTRY/PROFESSIONAL PARTICIPANTS**:  All must be affiliated with an IC3 Member or a Boot Camp Donor (see details below).

- __BOOT CAMP DONOR – $12.5k US__
    - Donations support the Boot Camp and on-going IC3 research.
    - Includes Donor Brand logo on the IC3 website, and social media outreach.
    - Includes Participation for up to Two Developers for the full week of Hacking and Learning, plus participation in the Celebration Dinner on July 19.
    - Includes Periodic Fun Activities.


- __IC3 MEMBERS__
    - IC3 Sponsor Members may participate at no charge.
    - IC3 Regular Members may participate at $5k per developer.

All Industry/Professional participants, please [apply here](https://docs.google.com/forms/d/e/1FAIpQLSfBq37rmPlBS0k8zuRwa8DltVYq7RcpkdOT15vPOd80HmR2aQ/viewform).
