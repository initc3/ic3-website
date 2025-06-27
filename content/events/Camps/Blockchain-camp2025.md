---
name: 'IC3 Blockchain Camp 2025'
location: Cornell Tech (Roosevelt Island) New York, NY
start: 2025-06-09
end: 2025-06-15
summary: Thank you for joining us the 9th Annual IC3 Blockchain Camp! This 7-day experience was hosted once again at the Cornell Tech Campus on Roosevelt Island, New York City. IC3's Technical Committee of <a href="https://x.com/sarahalle_?s=21">Sarah Allen</a>, <a href="https://x.com/suryabakshi?s=21">Surya Bakshi</a>, <a href="https://x.com/ethlorenz?s=21">Lorenz Breidenbach</a>, <a href="https://x.com/stonecoldpat0?s=21">Patrick McCorry</a>, and <a href="https://x.com/haaroony?s=21">Haaroon Yousaf</a> prepared another immersive coding and learning experience!
---

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2024/ic3 logo new.png" alt="" />
</div>

Months of planning, organizing, and scheduling finally came to fruition during the annual Blockchain Camp where we celebrated IC3’s 10-Year Anniversary. And yes, there was cake involved.

We produced ample research over the past decade, but it's just the beginning. As Phil Daian (IC3 alum & co-founder of Flashbots) <a href="https://x.com/initc3org/status/1933150796994195543">said during his Camp presentation</a> on MEV, the next five years are crucial in terms of research.

Here are some highlights from the Camp, plus an <a href="https://www.coindesk.com/opinion/2025/06/02/we-cant-regulate-our-way-to-crypto-leadership-we-still-need-science">open letter</a> by 10 leading U.S. academics about protecting the future of blockchain research, and upcoming events you don’t want to miss:


### HACKATHON WINNERS

We want to start off by congratulating our Camp hackathon winners!

**1st place - Risk-Aware Restaking**

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/1.jpg" alt="" width="700"/>
</div>

Restaking networks let validators reuse their staked assets to secure multiple blockchain services simultaneously. Roi Bar-Zur (Technion, IC3) and his team analyzed scenarios where services implement risk-aware caps to limit excessive restaking participation. 

The team proved that splitting their stake is mathematically optimal and developed algorithms to compute the best allocations across services. Although this doesn't exist today, they believe it could improve network security and result in better returns for validators.

To learn more about Risk-Aware Restaking, <a href="https://initc3org.medium.com/introducing-risk-aware-restaking-winners-of-the-2025-ic3-blockchain-camp-hackathon-18997e31343d">head to our blog</a> where we conducted a Q&A with Roi about the project.

*Team members: Roi Bar-Zur (Technion, IC3), Mateo Bastidas (Yale University), Hongyin Chen (Peking University, Technion, IC3), Dor Malka (Technion, IC3), Daniel Lee (Cornell University, IC3), Austin Li (Cornell University, IC3), Max Tang (Cornell University), and Sarisht Wadhwa (Duke University)*

**2nd place - DAO Buddy**

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/2.jpg" alt="" width="700"/>
</div>

<a href="https://x.com/sh1sh1nk/status/1936203170264273156">DAO Buddy</a> is an AI-powered governance companion designed to simplify DAO participation. Built on IC3’s <a href="https://public.tableau.com/app/profile/daovbe/viz/DAOoVBEDashboard/Voting-BlocEntropyOverview">VBE dashboard</a>, its goal is to reduce information overload and combat voter fatigue. The prototype pulls data from Tally, Tableau, Snapshot, LobbyFi, and the Arbitrum DAO forum to help Arbitrum DAO participants with tasks such as:

- Drafting clear, context-rich proposals that incorporate community sentiment
- Casting votes on active proposals
- Summarizing forum discussions
- Analyzing DAO delegate positions on various issues

*Team members: Shashank Motepalli﻿ (University of Toronto), Sam Breckenridge (Cornell University, IC3), Anika Lakhani (Harvard University), Haaroon Yousaf (IC3), and Amy Zhao (Ava Labs, IC3)*

**3rd place - DeadDrop**

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/3.jpg" alt="" width="700"/>
</div>

Prof. Fan Zhang (Yale University, IC3) and the team behind DeadDrop built a system for bug hunters to responsibly disclose smart contract bugs to deployers with confidentiality and spam prevention.

While existing BlockChat systems can be used to reach smart contract deployers, they also learn the message recipients, revealing which smart contracts are buggy. DeadDrop uses Oblivious Message Retrieval (OMR) and TEEs to ensure private communication between bug hunters and smart contract developers.

*Team members: Fan Zhang (Yale University, IC3), Jasleen Malvai (UIUC, IC3), Silei Ren (Cornell University, IC3), Stephanie Ma (Cornell University), Yavor Litchev (Stanford University), Mariarosaria Barbaraci (University of Bern, IC3), Jonas Chen (UCSB), Marwa Mouallem (Technion, IC3), and Cynthia Wang (Stanford University)*

**Honorable mention - T-E-Esports**

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/4.jpg" alt="" width="700"/>
</div>

The T-E-Esports team led by Andrew Miller (Teleport, Flashbots, IC3) identified how TEEs can reduce the reliance on trusted server operators in online games and enable blockchain interfaces with them.

They proved they can run a Luanti server (an open-source, Minecraft-like game engine) inside a TEE container which reads game settings from a smart contract, begins a 1v1 battle game, and finally reports the outcome of the battle to the smart contract.

*Team members: Andrew Miller (Teleport, Flashbots, IC3), Hang Yin (Phala Network), James Austgen (Cornell Tech, IC3), Jiasun Li (George MAson University), and Nerla Jean-Louis (UIUC, IC3)*


### CAMP HIGHLIGHTS

Our agenda covered a wide range of research topics including consensus, privacy, security, crypto AI, DAOs, and traditional finance. Here are highlights from this year’s Camp:

**MonadBFT: Fast, Responsive, Fork-Resistant Streamlined Consensus**

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Kushal.jpg" alt="" width="700"/>
</div>

Kushal Babel (Researcher at Category Labs & IC3 alum) broke down Monad’s consensus protocol, <a href="https://arxiv.org/abs/2502.20692">MonadBFT</a>, a pipelined BFT protocol designed for high-throughput L1 blockchains. MonadBFT draws inspiration from the HotStuff family of protocols, known for their linear communication complexity and responsiveness.

According to Kushal, some key features include:

- Fast execution with speculative single-round commit latency
- Prevents tail forking, resisting MEV time-bandit attacks
- Maintains core guarantees: optimistic responsiveness and linear message complexity on the happy path (when the network is synchronous and behavior is honest)

**Functional Regulation for Layer One Infrastructure** 

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Carla.jpg" alt="" width="700"/>
</div>

"When a reckless driver causes a collision on a highway, authorities charge the driver, not those who constructed the highway. The same principle should apply to the blockchain space," was the message Prof. Carla Reyes (SMU Dedman School of Law, IC3) wanted to drive home during her presentation <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5145302">Functional Regulation for Layer One Infrastructure</a>.

Carla's research argues that a functional approach to regulating distributed ledger technology leads to a conclusion that open-source L1 & L2 smart contract protocols are public digital infrastructure. Therefore, the law should ensure open access to such protocols and focus on regulating individuals or businesses conducting actionable activities via the infrastructure, rather than targeting the infrastructure itself or its developers.

**Alpenglow: Solana's New Consensus Protocol**

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Roger.jpg" alt="" width="700"/>
</div>

Leading expert in distributed systems Prof. Roger Wattenhofer (Head of Research, Anza) joined the Camp to talk about Solana's new consensus protocol, <a href="https://www.anza.xyz/blog/alpenglow-a-new-consensus-for-solana">Alpenglow</a>, that is set to be implemented later this year.

Alpenglow is designed to replace several legacy components of Solana's consensus stack (namely TowerBFT and Proof-of-History) with two new components: Votor and Rotor, which together optimize for performance and speed.

**Fraud Proof Protocols: BoLD, Dave, and other alternatives** 

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Victor.jpg" alt="" width="700"/>
</div>

Victor Shoup (Principal Research Scientist, Offchain Labs) examined two different fraud proof protocols (BoLD vs. Dave) during his Camp presentation. He noted while each has their own approach to bisection and multiple vs. single rounds of proving, there are trade-offs in terms of delay, resources required, and cost. You can access his research on the topic <a href="https://research.arbitrum.io/t/fraud-proof-protocols-bold-dave-and-other-alternatives/9748">here</a>.


### ANNIVERSARY DAY RECAP

**Selfish Mining** 

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Ittay.jpg" alt="" width="700"/>
</div>

﻿Prof. Ittay Eyal (Technion, IC3) shared his landmark 2014 research with Emin Gün Sirer (Founder & CEO of Ava Labs, former IC3 Co-director) <a href="https://arxiv.org/abs/1311.0243">Majority is not Enough: Bitcoin Mining is Vulnerable</a>.

They uncovered Selfish Mining, a strategy where miners can deviate from honest behavior and secretly mine blocks to game the system and earn outsized rewards.

**DECO: Oracles, zkTLS, and Data Liberation**

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Fan.jpg" alt="" width="700"/>
</div>

<a href="https://eprint.iacr.org/2016/168">Town Crier</a> and <a href="https://arxiv.org/abs/1909.00938">DECO</a> are two oracle protocols developed by IC3 researchers to securely bridge data from the web to smart contracts, but they differ significantly in trust assumptions, cryptographic techniques, and privacy guarantees.

Prof. Fan Zhang (Yale University, IC3), lead author of both papers, spoke about his original research, some of the technical challenges each protocol presents, and overall impact on the industry.

**A Fistful of Bitcoins**

By now, many of us probably forget a time when the price of BTC was hovering around $100 and the Silk Road was a thriving cryptocurrency bazaar. 

During the Camp, Sarah Meiklejohn (UCL, IC3) presented her 2012 research, <a href="https://cseweb.ucsd.edu/~smeiklejohn/files/imc13.pdf">A Fistful of Bitcoins: Characterizing Payments Among Men with No Names</a>, which explored how Bitcoin was used at the time, and whether its users could be identified. 

By combining heuristics, clustering techniques, and layered data collection, her team was able to trace onchain activity and link multiple addresses to individual users. As a result, she helped successfully track $3+ million in BTC to illicit activities.

The takeaway? It is nearly impossible to remain anonymous on Bitcoin.

**Fireside Chat: Scaling Ethereum**

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Chat.jpg" alt="" width="700"/>
</div>

Steven Goldfeder (Co-founder & CEO of Offchain Labs, IC3 alum) and Prof. Ari Juels (IC3 Co-director, Chainlink Labs) <a href="https://x.com/initc3org/status/1933261808258986242">reflected on the early days</a> of building Arbitrum, when Steven was a postdoctoral researcher at Cornell Tech under Ari's guidance.

"At the time, it [scaling] was still a somewhat controversial subject," said Steven. "No one saw it as a problem that needed to be solved." Fast forward to 2025, and scaling blockchain infrastructure remains one of the biggest challenges facing the industry today, including Ethereum.

Steven's advice for new founders?

"Fight for your ideas. If you believe in what you're building and you're right, people will eventually come around," said Steven. Today, Arbitrum is the largest L2 in the blockchain ecosystem, securing <a href="https://l2beat.com/scaling/summary">more than $13B</a> in value.

**Panel: The DAO Hack & Ethereum Hard Fork** 

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Panel.jpg" alt="" width="700"/>
</div>

The DAO hack and Ethereum hard fork of 2016 remains one of the most important yet controversial events in blockchain history.

IC3 <a href="https://x.com/initc3org/status/1933641856572928176">hosted a panel</a> featuring Emin Gün Sirer (Ava Labs, former IC3 Co-Director), Phil Daian (Flashbots, IC3), Tjaden Hess (Trail of Bits), Laura Shin (Unchained), and Patrick McCorry (Arbitrum Foundation, IC3), who closely followed the attack as it unfolded.

IC3 played a notable role in the events leading up to the hard fork. Its researchers were among the first to publicly identify The DAO’s vulnerabilities, including reentrancy hazards, and called for a temporary moratorium before the $50M exploit occurred. The hard fork itself was implemented during the 2016 IC3 bootcamp, attended by Ethereum co-founder Vitalik Buterin and former Ethereum developer Vlad Zamfir. Both played a pivotal role in the hard fork decision and implementation. 

Looking for more 2025 Camp Highlights? Check out our <a href="https://x.com/initc3org">X</a> and <a href="https://www.linkedin.com/company/the-initiative-for-cryptocurrencies-contracts-ic3/posts/?feedView=all">LinkedIn</a> pages where we shared photos and recaps of the talks and presentations.

### OUR PARTENRS & SPONSORS

We’d like to thank our partners and sponsors for their continued support in funding IC3’s research and events throughout the year.

﻿A special thanks to <a href="https://chain.link/">Chainlink</a>, <a href="https://phala.network/">Phala Network</a>, and <a href="https://solana.org/">The Solana Foundation</a> for sponsoring this year’s IC3 Blockchain Camp.

<div class="ui piled segment">
  <img class="ui centered image" src="../images/events/blockchain-camp-2025/Group.jpg" alt="" width="800"/>
  <div class="ui bottom center attached message">
  <strong>Thank you again to everyone who participated in this year’s event! ﻿﻿We hope to see you again next year!</strong><br>
  </div>
</div>

<!---
### REGISTRATION & SPONSORSHIP
 
<p align="center">
	<a href="https://docs.google.com/forms/d/e/1FAIpQLSfQ0fRt83xgZRvkz3x6sdWFVlxWk_l8Q__lXqQ5nT5Y2riIhg/viewform"> 
	   <img src="../images/events/blockchain-camp-2024/Register.jpeg" width="200" />	
	</a>	
</p>

**Students:** We are offering free access to a limited number of well-qualified full-time students enrolled at the IC3 campuses (Carnegie Mellon University, Cornell University, Cornell Tech, EPFL, ETH Zurich, Princeton University, Southern Methodist University, University of Bern, UC Berkeley, University College London, UIUC, Technion, and Yale University). 

**Industry/Professional Participants:** All must be affiliated with an IC3 Member or a Blockchain Camp Sponsor (see details below).

***1. IC3 Members***

Up to two employees of IC3 Partner Members (see current list of partners **<a href="https://www.initc3.org/partners">here</a>**) may participate free of charge.

***2. Blockchain Camp Sponsorship - $15k includes:***

- Support for the Camp, including scholarships for students attending for free, and ongoing IC3 research. <br>
- Sponsor brand logo displayed on the Camp page, and social media outreach. <br>
- Participation for one person for the full week of hacking and learning, plus meals, excursions, and the Camp closing party. <br>


> **Note:** <br>
> Exceptions will be made on a case-by-case basis to allow additional community members to participate in the camp without sponsorship. Please email Ashley Stanhope (<a href="mailto:ashley@hardfork.media">ashley@hardfork.media</a>) if you would like to apply for non-donor participation. Please indicate in the application form below if you would like to apply for camp sponsorship or for participation without a sponsor. 

All Industry/Professional participants, please apply **<a href="https://docs.google.com/forms/d/e/1FAIpQLSfQ0fRt83xgZRvkz3x6sdWFVlxWk_l8Q__lXqQ5nT5Y2riIhg/viewform">here</a>**.


### CAMP SCHEDULE

See a full and day-by-day agenda below. 

<div style="margin-left:75px;width:auto">

<iframe height="600" width="1130" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTwKQKfbKQMJtmgOjJAEtRww5JEh7d6FJuPqkErYU0qyCLfJlIrMIILTrgz8NqnrrJOgMZYMHftQPE2/pubhtml?widget=true&amp;headers=false"></iframe>

</div>


### PROGRAM

We will offer two overlapping tracks: a coding track and a presentation track.

**Option 1 (Coding):** The coding track includes all presentations, social activities, and participation in a weeklong coding project on a 5-10 person team. In the coding track, you can expect to engage with leaders in the blockchain community - faculty, architects, developers, students.

**Option 2 (Presentation):** The presentation track will be open to those who want to participate in the camp events without joining a coding team.

Both tracks require pre-registration. Please use the **<a href="https://docs.google.com/forms/d/e/1FAIpQLSfQ0fRt83xgZRvkz3x6sdWFVlxWk_l8Q__lXqQ5nT5Y2riIhg/viewform">registration form</a>**. Those who register will receive additional details by email before the event.

Please check previous camp editions for details <a href="https://www.initc3.org/events/2024-06-10-ic3-blockchain-camp-2024">2024</a>, <a href="https://www.initc3.org/events/2023-06-12-ic3-blockchain-camp-2023">2023</a>, <a href="https://www.initc3.org/events/2022-08-01-ic3-blockchain-camp-2022">2022</a>.
--->

<!---
### ACCOMMODATIONS

IC3 has a room block and recommends reserving at the **<a href="https://www.hilton.com/en/hotels/nycgngu-graduate-new-york/">Graduate Hotel</a>** located on the Cornell Tech campus on Roosevelt Island due to its proximity to the event location. Oana Gherman, IC3 Sr. Administrative Assistant (<a href="mailto:og64@cornell.edu">oana.gherman@cornell.edu</a>) will centrally book rooms for anyone who chooses to be part of the room block. If you say yes to being included, please do not book a room for yourself. (You will then have two rooms.) Reach out to her if you have questions or need more information. Block reservation deadline **May 6, 2025.**

> **Important Note:** <br>
> Students are expected to share accommodations with other students attending the Camp. If you need assistance finding other students who are attending, please don't hesitate to reach out to Oana or mention it when submitting your registration.
--->
