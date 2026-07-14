/* ============================================================
   DetectiveHub — Case Data
   All narrative content for the 5 cases, plus static reference
   data (quotes, ranks, achievement definitions).
   ============================================================ */

const RANKS = [
  { name: "Rookie",            min: 0    },
  { name: "Officer",           min: 100  },
  { name: "Investigator",      min: 300  },
  { name: "Detective",         min: 600  },
  { name: "Senior Detective",  min: 1000 },
  { name: "Master Detective",  min: 1500 }
];

function getRankForPoints(points) {
  let current = RANKS[0];
  for (const r of RANKS) if (points >= r.min) current = r;
  return current;
}

function getNextRank(points) {
  for (const r of RANKS) if (points < r.min) return r;
  return null;
}

const DAILY_QUOTES = [
  "\u201CThe world is full of obvious things which nobody by any chance ever observes.\u201D",
  "\u201CWhen you have eliminated the impossible, whatever remains, however improbable, must be the truth.\u201D",
  "\u201CIt is a capital mistake to theorize before one has data.\u201D",
  "\u201CThere is nothing more deceptive than an obvious fact.\u201D",
  "\u201CThe game is afoot.\u201D",
  "\u201CA case is never solved until every question has an answer, even the small ones.\u201D",
  "\u201CTrust the evidence, not the story you want it to tell.\u201D",
  "\u201CEvery contact leaves a trace.\u201D",
  "\u201CThe smallest clue can unravel the largest lie.\u201D",
  "\u201CListen twice as long as you speak \u2014 witnesses reveal more in what they avoid.\u201D",
  "\u201CMotive tells you why. Evidence tells you who.\u201D",
  "\u201CA good detective doubts everyone, including themselves.\u201D"
];

const ACHIEVEMENTS = [
  { id: "first_case",   name: "First Case Solved",     desc: "Close out your very first case.",              icon: "\u{1F31F}" },
  { id: "puzzle_master", name: "Puzzle Master",        desc: "Win all 6 investigation mini-games.",          icon: "\u{1F9E9}" },
  { id: "sharp_observer", name: "Sharp Observer",       desc: "Find every hidden clue in a single case.",     icon: "\u{1F441}\uFE0F" },
  { id: "code_breaker",  name: "Code Breaker",          desc: "Successfully decode a cipher.",                icon: "\u{1F511}" },
  { id: "evidence_expert", name: "Evidence Expert",     desc: "Inspect every piece of evidence in a case.",   icon: "\u{1F4C1}" },
  { id: "perfect_investigation", name: "Perfect Investigation", desc: "Solve a case correctly, first try, all clues found.", icon: "\u{1F3C6}" }
];

/* Evidence type -> icon glyph used across the UI */
const EVIDENCE_ICONS = {
  photo: "\u{1F4F7}",
  document: "\u{1F4C4}",
  fingerprint: "\u{1F446}",
  weapon: "\u{1F5E1}\uFE0F",
  map: "\u{1F5FA}\uFE0F",
  phone: "\u{1F4F1}",
  cctv: "\u{1F4F9}",
  receipt: "\u{1F9FE}",
  letter: "\u2709\uFE0F"
};

/* ============================================================
   CASES
   ============================================================ */
const CASES = [

/* ---------------------------------------------------------- */
/* CASE 01                                                     */
/* ---------------------------------------------------------- */
{
  id: "blackwood",
  number: "001",
  title: "The Blackwood Manor Murder",
  difficulty: "Easy",
  tagline: "A lord is dead. The house is full of secrets.",
  story: [
    "Blackwood Manor sits at the end of a fog-choked lane, its windows dark except for one: the study of Lord Edmund Blackwood.",
    "At 9:40 PM, his scream cut through the house. When the staff broke down the locked study door, they found him slumped over his desk, a cold cup of tea beside him, and a will that had been rewritten only that morning.",
    "The family, the staff, and one uninvited guest all had a reason to want him gone. You have until sunrise to name the killer."
  ],
  victim: {
    name: "Lord Edmund Blackwood",
    age: 61,
    occupation: "Industrialist & Landowner",
    causeOfDeath: "Poisoning (oleandrin, ingested via tea)",
    bio: "A ruthless businessman who rebuilt the family fortune by underpaying suppliers and overpromising investors. Widely respected in public, widely resented in private. Rewrote his will the morning of his death."
  },
  suspects: [
    {
      id: "s1", name: "Margaret Blackwood", age: 54, occupation: "Wife",
      motive: "Learned that morning she had been cut out of the new will entirely.",
      alibi: "Claims she was in the east wing reading; no one can confirm it.",
      photo: "\u{1F469}", guilty: false
    },
    {
      id: "s2", name: "Nigel Hartley", age: 47, occupation: "Business Partner",
      motive: "Edmund was about to expose Nigel's embezzlement to the board.",
      alibi: "Says he left the manor at 9:00 PM \u2014 the gatehouse log disagrees by twenty minutes.",
      photo: "\u{1F468}\u200D\u{1F4BC}", guilty: true
    },
    {
      id: "s3", name: "Ellis Cobb", age: 33, occupation: "Butler",
      motive: "Edmund threatened to have him deported after finding old immigration papers.",
      alibi: "Was serving tea to the study at 9:15 PM \u2014 the last person confirmed to see Edmund alive.",
      photo: "\u{1F935}", guilty: false
    },
    {
      id: "s4", name: "Rosalind Vance", age: 29, occupation: "Gardener",
      motive: "Edmund fired her father decades ago; she grows oleander in the greenhouse for 'pest control.'",
      alibi: "Was locking the greenhouse at the time of death, seen by a stable hand.",
      photo: "\u{1F469}\u200D\u{1F33E}", guilty: false
    }
  ],
  witnesses: [
    { name: "Mrs. Pruitt, Housekeeper", statement: "I heard raised voices from the study around 8:45 \u2014 a man's voice, not Ellis's. Sounded like an argument about money.", reliability: "High" },
    { name: "Tobias, Stable Hand", statement: "Miss Vance was at the greenhouse the whole time, I was mucking out stalls across the yard and could see her lantern.", reliability: "Medium" },
    { name: "Gate Attendant", statement: "Mr. Hartley's car left at 9:20, not 9:00 like he told the inspector. I logged it myself.", reliability: "High" }
  ],
  crimeScene: {
    location: "Lord Blackwood's Private Study, Second Floor",
    description: "The study was locked from the inside; the key was still in the lock. A teacup, half-finished, sat by his right hand. The rewritten will lay open on the desk, ink barely dry. A side door leading to the servants' stair was found unlocked, though staff insist it's always kept bolted.",
    details: [
      "Window latch shows fresh scratches, possibly forced from outside.",
      "The servants' stair door bolt was oiled recently \u2014 too quiet to hear open.",
      "A faint floral smell lingers near the teacup, out of place in a study that smells of pipe tobacco."
    ]
  },
  evidence: [
    { id: "e1", type: "document", title: "The Rewritten Will", description: "Dated the morning of the murder. Cuts Margaret out entirely and gives Nigel Hartley's shares to a mystery beneficiary listed only as 'the Board.'" },
    { id: "e2", type: "photo", title: "Teacup Residue", description: "Lab photo showing a fine yellow-green residue coating the inside of the cup \u2014 consistent with crushed oleander seed." },
    { id: "e3", type: "map", title: "Manor Floor Plan", description: "Marks the servants' stair connecting the kitchen directly to the study's side door, bypassing the main hall entirely." },
    { id: "e4", type: "fingerprint", title: "Prints on the Teapot", description: "Two sets of prints: Ellis Cobb's (expected \u2014 he served the tea) and a partial second set on the underside, not yet matched." },
    { id: "e5", type: "receipt", title: "Greenhouse Ledger", description: "Rosalind's neat records show oleander harvested three weeks ago for pest control, all accounted for in inventory." },
    { id: "e6", type: "letter", title: "Board Warning Letter", description: "A letter from the company's auditors, dated two days prior, warning Edmund that 'irregularities' in Hartley's accounts would be reported within the week." },
    { id: "e7", type: "photo", title: "Gatehouse Log Photo", description: "A photograph of the sign-out sheet: Hartley's car listed leaving at 9:20 PM, not 9:00 as he told investigators." },
    { id: "e8", type: "document", title: "Servants' Stair Bolt Report", description: "A locksmith's note confirming the bolt mechanism was oiled within the last 48 hours \u2014 someone wanted it silent." },
    { id: "e9", type: "phone", title: "Study Telephone Log", description: "Shows an outgoing call placed from the study at 8:50 PM to Nigel Hartley's private line, lasting four minutes." }
  ],
  timeline: [
    { time: "8:30 PM", event: "Edmund retires to his study after dinner, taking the rewritten will with him." },
    { time: "8:45 PM", event: "Mrs. Pruitt overhears a heated argument from the study." },
    { time: "8:50 PM", event: "A call is placed from the study telephone to Nigel Hartley's private line." },
    { time: "9:15 PM", event: "Ellis Cobb delivers tea to the study \u2014 last confirmed sighting of Edmund alive." },
    { time: "9:20 PM", event: "Gatehouse logs Hartley's car leaving the estate." },
    { time: "9:40 PM", event: "Edmund's scream is heard; staff force open the locked study door." }
  ],
  hiddenClues: [
    { id: "h1", relatedEvidence: "e8", description: "The oiled bolt on the servants' stair suggests the poisoner entered and left without passing the main hall \u2014 someone with staff-level access to the house's back passages." },
    { id: "h2", relatedEvidence: "e9", description: "The 8:50 PM call to Hartley's private line, only ten minutes before Edmund confirmed drinking his tea, places Hartley in direct contact with the victim far closer to the time of death than his stated alibi allows." },
    { id: "h3", relatedEvidence: "e4", description: "The unmatched partial print on the teapot's underside doesn't belong to any staff member fingerprinted that night \u2014 it points to a guest who touched the pot after Ellis set it down." }
  ],
  accusation: {
    correctSuspectId: "s2",
    endings: {
      s2: {
        title: "Case Closed: The Partner's Debt",
        success: true,
        text: "Confronted with the gatehouse log and the study call, Nigel Hartley's composure cracks. He admits to slipping back through the servants' stair \u2014 a door he'd bribed a maid to oil weeks earlier \u2014 to poison the tea before Edmund could report him to the auditors. The rewritten will was never really about Margaret; it was the trigger that made Hartley believe his exposure was imminent. He is arrested at dawn."
      },
      s1: {
        title: "Case Closed: A Costly Mistake",
        success: false,
        text: "You accuse Margaret Blackwood. She has no alibi and every reason to resent the will \u2014 but the evidence doesn't fit. Weeks later, Nigel Hartley's forged accounts surface at a rival firm, and the true killer is never brought to justice. Margaret is released, but the real culprit walks free."
      },
      s3: {
        title: "Case Closed: The Wrong Servant",
        success: false,
        text: "You accuse Ellis Cobb. He served the tea, yes \u2014 but he had no motive strong enough for murder, and the unmatched fingerprint was never his. The case collapses in court for lack of evidence, and Ellis is quietly deported anyway, an injustice you could have prevented."
      },
      s4: {
        title: "Case Closed: The Gardener's Alibi",
        success: false,
        text: "You accuse Rosalind Vance. Her ledger was clean and her alibi solid \u2014 the stable hand's testimony holds up under scrutiny. The true killer, still unidentified in the official record, is never named. Rosalind loses her position over the accusation alone."
      }
    }
  }
},

/* ---------------------------------------------------------- */
/* CASE 02                                                     */
/* ---------------------------------------------------------- */
{
  id: "harrow",
  number: "002",
  title: "Silence at Harrow Theatre",
  difficulty: "Medium",
  tagline: "The curtain fell. So did the leading lady.",
  story: [
    "Opening night at the Harrow Theatre should have been a triumph. Instead, during the final act's blackout, leading actress Vivian Marsh collapsed on stage and never rose again.",
    "The lights came back up on a full house of witnesses who saw nothing \u2014 the murder happened in eight seconds of darkness.",
    "Backstage is a maze of jealousy, ambition, and old grudges. Somewhere in it is the person who used the blackout as their stage."
  ],
  victim: {
    name: "Vivian Marsh",
    age: 38, occupation: "Leading Actress",
    causeOfDeath: "Stabbing (prop dagger, secretly sharpened)",
    bio: "A celebrated but difficult star known for stealing roles from rivals and publicly humiliating crew members. Her contract renewal, due the next morning, would have pushed her understudy out of the company entirely."
  },
  suspects: [
    {
      id: "s1", name: "Delphine Reyes", age: 27, occupation: "Understudy",
      motive: "Losing her contract renewal meant losing her only shot at the lead role she'd waited three years for.",
      alibi: "Says she was in the wings the whole blackout \u2014 but the wings are empty of witnesses during a blackout by design.",
      photo: "\u{1F469}\u200D\u{1F3A4}", guilty: false
    },
    {
      id: "s2", name: "Marcus Boone", age: 51, occupation: "Director",
      motive: "Vivian was about to reveal his affair with a producer's wife to the press, threatening his career.",
      alibi: "Claims he was in the control booth calling cues \u2014 the booth log shows a two-minute gap in his cue calls during the blackout.",
      photo: "\u{1F468}\u200D\u{1F3A8}", guilty: true
    },
    {
      id: "s3", name: "Harold Finch", age: 45, occupation: "Head Stagehand",
      motive: "Vivian had him blacklisted from three prior productions after a public dressing-down.",
      alibi: "Confirmed on the fly rail by two other stagehands the entire blackout.",
      photo: "\u{1F468}\u200D\u{1F527}", guilty: false
    },
    {
      id: "s4", name: "Coraline Ash", age: 40, occupation: "Theatre Critic",
      motive: "Vivian was blackmailing her over a plagiarized review; Coraline's career would end if it surfaced.",
      alibi: "Was seated in the front row, visible to dozens of audience members throughout.",
      photo: "\u{1F469}\u200D\u{1F4BB}", guilty: false
    }
  ],
  witnesses: [
    { name: "Sound Engineer", statement: "The booth log shows Marcus missed two lighting cues during the blackout \u2014 first time in the whole run he's ever missed one.", reliability: "High" },
    { name: "Front Row Patron", statement: "The critic never left her seat, I was sitting right behind her the entire second act.", reliability: "High" },
    { name: "Fly Rail Stagehand", statement: "Harold was up on the rail with us the whole blackout, hauling the backdrop. Couldn't have gotten to the stage floor in time.", reliability: "High" }
  ],
  crimeScene: {
    location: "Center Stage, Harrow Theatre",
    description: "Vivian fell exactly where her blocking placed her for the final scene. The prop dagger, normally retractable and blunt, had been swapped for a sharpened twin, indistinguishable from backstage under stage lighting.",
    details: [
      "The prop table shows the dagger was swapped sometime after the 7:00 PM prop check.",
      "A faint scuff mark near the stage-left curtain suggests someone crossed the stage floor during the blackout, off the marked blocking path.",
      "The control booth's cue sheet has a coffee stain over the exact cues that were missed."
    ]
  },
  evidence: [
    { id: "e1", type: "weapon", title: "The Sharpened Dagger", description: "A prop dagger, professionally sharpened along one edge, swapped for the safe stage prop sometime after the 7 PM check." },
    { id: "e2", type: "document", title: "Prop Check Log", description: "Signed off at 7:00 PM by the props master confirming the real (blunt) dagger was in place before the show." },
    { id: "e3", type: "cctv", title: "Backstage Corridor Camera", description: "Grainy footage showing a shadow crossing near the prop table at 7:40 PM \u2014 face obscured by a costume rack." },
    { id: "e4", type: "document", title: "Cue Sheet", description: "The booth's lighting cue sheet, stained with coffee exactly over the two missed cues during the blackout." },
    { id: "e5", type: "letter", title: "Blackmail Note Draft", description: "A half-written note in Vivian's dressing room addressed to 'M.B.' threatening to expose an affair unless he resigned as director." },
    { id: "e6", type: "phone", title: "Marcus's Phone Records", description: "A text sent to an unknown number at 7:35 PM: 'It has to happen tonight, during the blackout, or never.'" },
    { id: "e7", type: "photo", title: "Costume Rack Photo", description: "Shows the rack blocking the corridor camera's view of the prop table \u2014 moved there only on opening night." },
    { id: "e8", type: "document", title: "Contract Renewal Draft", description: "Shows Delphine's role would be terminated the morning after opening night, redistributing her lines to a new hire." },
    { id: "e9", type: "receipt", title: "Sharpening Kit Receipt", description: "A hardware store receipt for a knife-sharpening kit, purchased three days prior, paid in cash \u2014 no name attached." }
  ],
  timeline: [
    { time: "7:00 PM", event: "Props master signs off on the prop check; the dagger is confirmed blunt." },
    { time: "7:35 PM", event: "A text is sent from Marcus's phone: 'It has to happen tonight, during the blackout, or never.'" },
    { time: "7:40 PM", event: "A shadow crosses near the prop table on the backstage camera, obscured by a moved costume rack." },
    { time: "9:10 PM", event: "Final act blackout begins; two lighting cues are missed in the booth." },
    { time: "9:10 PM +8s", event: "Lights return; Vivian Marsh collapses center stage." }
  ],
  hiddenClues: [
    { id: "h1", relatedEvidence: "e7", description: "The costume rack was only moved to block the corridor camera on opening night \u2014 someone with schedule knowledge planned the swap in advance, not on impulse." },
    { id: "h2", relatedEvidence: "e6", description: "The 7:35 PM text referencing 'the blackout' specifically means the sender knew the exact blocking and lighting plan \u2014 knowledge only the director would have with certainty." },
    { id: "h3", relatedEvidence: "e4", description: "The coffee stain covers precisely the two missed cues and nothing else on the sheet \u2014 suggesting it was staged after the fact to explain an absence from the booth, not an accident." }
  ],
  accusation: {
    correctSuspectId: "s2",
    endings: {
      s2: {
        title: "Case Closed: Missed Cues",
        success: true,
        text: "Marcus Boone's phone records and the too-convenient coffee stain unravel his story. He crossed the stage during the blackout he designed himself, swapped daggers he'd sharpened days earlier, and returned to the booth before the lights rose \u2014 missing two cues he could never explain away. He is taken into custody before the curtain call encore."
      },
      s1: {
        title: "Case Closed: A Career Ended Early",
        success: false,
        text: "You accuse Delphine Reyes. Her motive was real, but she had no way to move that costume rack or reach the booth's cue sheet. The accusation costs her the role she wanted and the company's trust. The true killer directs the next production."
      },
      s3: {
        title: "Case Closed: An Honest Stagehand",
        success: false,
        text: "You accuse Harold Finch. Two witnesses place him on the fly rail throughout the blackout. The case falls apart immediately, and Harold's blacklisting becomes permanent over the accusation alone."
      },
      s4: {
        title: "Case Closed: The Critic's Alibi",
        success: false,
        text: "You accuse Coraline Ash. Dozens of audience members confirm she never left her seat. The real killer remains free to take a bow at the next opening night."
      }
    }
  }
},

/* ---------------------------------------------------------- */
/* CASE 03                                                     */
/* ---------------------------------------------------------- */
{
  id: "midnight-express",
  number: "003",
  title: "The Midnight Express",
  difficulty: "Medium",
  tagline: "A locked cabin. A moving train. Nowhere to run.",
  story: [
    "The Midnight Express departed the station at 11:58 PM with fourteen passengers in the first-class carriage. By dawn, one of them \u2014 wealthy shipping magnate Desmond Cole \u2014 was dead in his locked cabin.",
    "No one boarded or left the train between stations. The killer is still aboard, sharing breakfast with the other passengers.",
    "You have until the train reaches its final stop to name them."
  ],
  victim: {
    name: "Desmond Cole",
    age: 58, occupation: "Shipping Magnate",
    causeOfDeath: "Strangulation",
    bio: "Built his fortune importing goods through routes rumored to skirt customs entirely. Made enemies of business rivals, underpaid crew, and at least one family member cut from his will after a public falling-out."
  },
  suspects: [
    {
      id: "s1", name: "Vera Cole", age: 55, occupation: "Estranged Wife",
      motive: "Desmond was finalizing a divorce that would leave her with nothing; the papers were in his cabin.",
      alibi: "Says she was asleep in her own cabin two doors down \u2014 no one can confirm it.",
      photo: "\u{1F469}\u200D\u{1F9B3}", guilty: false
    },
    {
      id: "s2", name: "Julian Vance", age: 42, occupation: "Rival Shipping Owner",
      motive: "Desmond had just undercut a contract that would have bankrupted Julian's company.",
      alibi: "Claims he was playing cards in the lounge car until 1 AM \u2014 the conductor's punch-clock log disagrees.",
      photo: "\u{1F934}", guilty: true
    },
    {
      id: "s3", name: "Priya Anand", age: 31, occupation: "Onboard Physician",
      motive: "Desmond's company was responsible for a shipping accident that killed her brother years ago.",
      alibi: "Was treating a sick passenger in the third-class carriage, confirmed by that passenger.",
      photo: "\u{1F469}\u200D\u2695\uFE0F", guilty: false
    },
    {
      id: "s4", name: "Reginald Okafor", age: 39, occupation: "Train Conductor",
      motive: "Desmond had threatened to report him for smuggling goods in the cargo car, ending his career.",
      alibi: "Was completing his hourly walk-through of every carriage, logged and stamped at each door.",
      photo: "\u{1F468}\u200D\u2708\uFE0F", guilty: false
    }
  ],
  witnesses: [
    { name: "Lounge Car Bartender", statement: "Mr. Vance left the card table around midnight, said he needed air on the platform between cars. Didn't come back for almost forty minutes.", reliability: "High" },
    { name: "Third-Class Passenger", statement: "Dr. Anand treated my fever from midnight until nearly 1:30 \u2014 wouldn't leave my side, bless her.", reliability: "High" },
    { name: "Vera's Maid", statement: "I heard Mrs. Cole's door open around 12:15, but I assumed she was fetching water. I didn't see where she went.", reliability: "Low" }
  ],
  crimeScene: {
    location: "Cabin 4, First-Class Carriage",
    description: "The cabin door was locked from inside with the privacy latch engaged, but the connecting window to the platform between cars was found unlatched \u2014 a detail the porter insists is always locked for safety.",
    details: [
      "A torn cufflink, not matching Desmond's set, was found wedged in the window frame.",
      "The divorce papers on the desk are stained with the same cologne found on the murder weapon.",
      "Scuff marks on the platform between cars suggest someone climbed through the connecting window rather than the door."
    ]
  },
  evidence: [
    { id: "e1", type: "photo", title: "Cabin Window Photo", description: "Shows the connecting window's latch broken from outside force \u2014 not from inside as a stuck window might suggest." },
    { id: "e2", type: "document", title: "Punch-Clock Log", description: "The conductor's hourly log shows no record of Julian Vance in the lounge car between 12:00 and 12:40 AM." },
    { id: "e3", type: "fingerprint", title: "Cufflink Fragment", description: "A torn cufflink wedged in the window frame, engraved with the initials 'J.V.'" },
    { id: "e4", type: "document", title: "Divorce Papers", description: "Found on the desk, finalized that evening, cutting Vera out with only a modest settlement." },
    { id: "e5", type: "letter", title: "Rival Contract Letter", description: "A letter from Desmond's company undercutting Julian Vance's biggest shipping contract by 40%, dated the day before departure." },
    { id: "e6", type: "photo", title: "Cologne Stain Analysis", description: "A lab photo matching a distinctive cologne on the divorce papers to a bottle later found in Julian Vance's luggage." },
    { id: "e7", type: "map", title: "Carriage Layout Map", description: "Shows the platform between cars connects Cabin 4's window directly to the lounge car's rear door, a shortcut bypassing the corridor." },
    { id: "e8", type: "document", title: "Cargo Manifest", description: "Reginald's cargo records, meticulously kept, show no discrepancies \u2014 contradicting Desmond's smuggling accusation." },
    { id: "e9", type: "receipt", title: "Card Table Tab", description: "The lounge car's drink tab shows Julian's last order was at 11:55 PM, with no further orders until well past 1 AM." }
  ],
  timeline: [
    { time: "11:58 PM", event: "The Midnight Express departs the station." },
    { time: "12:00 AM", event: "Julian Vance leaves the card table for 'air' on the platform between cars." },
    { time: "12:15 AM", event: "Vera Cole's cabin door is heard opening by her maid." },
    { time: "12:20 AM (approx.)", event: "Desmond Cole is strangled in Cabin 4; the connecting window is forced from outside." },
    { time: "12:40 AM", event: "Julian Vance returns to the lounge car card table, visibly out of breath." },
    { time: "6:15 AM", event: "Desmond's body is discovered by the porter during the wake-up round." }
  ],
  hiddenClues: [
    { id: "h1", relatedEvidence: "e7", description: "The platform between cars is a direct, unmonitored shortcut between the lounge car and Cabin 4's window \u2014 explaining how someone could vanish from the card table and return without passing through the main corridor." },
    { id: "h2", relatedEvidence: "e3", description: "The cufflink fragment's initials match Julian Vance exactly, and a matching cufflink missing from his jacket was noted by the porter during questioning." },
    { id: "h3", relatedEvidence: "e6", description: "The cologne on the divorce papers, seemingly incriminating Vera's side of the story, actually matches a bottle in Julian's luggage, not anything belonging to Vera \u2014 he touched the papers after the murder, searching for the finalized divorce to confirm his rival's financial ruin was sealed." }
  ],
  accusation: {
    correctSuspectId: "s2",
    endings: {
      s2: {
        title: "Case Closed: Off the Rails",
        success: true,
        text: "Confronted with the torn cufflink and the punch-clock gap, Julian Vance's alibi collapses. He'd slipped onto the platform between cars, forced the connecting window, and strangled Desmond in under fifteen minutes before returning to the card table \u2014 leaving only a scrap of engraved gold behind. He's handed over to authorities at the final stop."
      },
      s1: {
        title: "Case Closed: A Grieving Widow",
        success: false,
        text: "You accuse Vera Cole. Her motive was compelling, but no evidence places her at the window, and the true trail leads elsewhere. The real killer disembarks at the next station, free."
      },
      s3: {
        title: "Case Closed: The Physician's Vigil",
        success: false,
        text: "You accuse Dr. Priya Anand. A grateful, feverish passenger and hours of treatment records clear her instantly. The accusation damages her reputation for nothing \u2014 the true culprit was never questioned again."
      },
      s4: {
        title: "Case Closed: An Honest Conductor",
        success: false,
        text: "You accuse Reginald Okafor. His logs are spotless and his walk-through times are corroborated by every carriage door stamp. He loses his job over the accusation regardless. The real killer rides on."
      }
    }
  }
},

/* ---------------------------------------------------------- */
/* CASE 04                                                     */
/* ---------------------------------------------------------- */
{
  id: "channel-9",
  number: "004",
  title: "Static on Channel 9",
  difficulty: "Hard",
  tagline: "Live television. A dead anchor. Everyone was watching.",
  story: [
    "Channel 9's star news anchor, Rita Alvarez, was found dead in her dressing room minutes before the 11 PM broadcast, electrocuted by a rigged microphone cable.",
    "The newsroom runs on ambition and surveillance \u2014 every hallway has a camera, every phone a record. Somewhere in that digital trail is the truth.",
    "The broadcast must go on. So must the investigation."
  ],
  victim: {
    name: "Rita Alvarez",
    age: 44, occupation: "Lead News Anchor",
    causeOfDeath: "Electrocution (rigged microphone cable)",
    bio: "The face of Channel 9 for a decade, known for breaking stories that ended careers \u2014 including, recently, an exposé she was drafting on the station's own leadership."
  },
  suspects: [
    {
      id: "s1", name: "Dana Kessler", age: 48, occupation: "Executive Producer",
      motive: "Rita's unfinished exposé named Dana in a kickback scheme with an advertiser.",
      alibi: "Says she was in the control room the entire time \u2014 badge logs show a six-minute gap.",
      photo: "\u{1F469}\u200D\u{1F4BC}", guilty: true
    },
    {
      id: "s2", name: "Trent Whitfield", age: 39, occupation: "Rival Anchor",
      motive: "Rita's exposé would have vaulted her to network anchor, the job Trent had chased for years.",
      alibi: "On set doing final sound checks, confirmed by three crew members and a live studio camera.",
      photo: "\u{1F468}\u200D\u{1F4BC}", guilty: false
    },
    {
      id: "s3", name: "Ines Ortega", age: 24, occupation: "Production Intern",
      motive: "Rita had recently reported her for tampering with an editing timeline, threatening her career before it began.",
      alibi: "Badge shows her in the archive room the entire window, confirmed by her badge-swipe timestamps.",
      photo: "\u{1F9D1}\u200D\u{1F4BB}", guilty: false
    },
    {
      id: "s4", name: "Carl Alvarez", age: 46, occupation: "Ex-Husband",
      motive: "A bitter custody dispute; Rita had just won full custody of their son the day before.",
      alibi: "Was at a restaurant across town, confirmed by a credit card receipt and the waiter's statement.",
      photo: "\u{1F468}\u200D\u{1F527}", guilty: false
    }
  ],
  witnesses: [
    { name: "Sound Technician", statement: "The mic cable was fine at the 10:30 check. Whoever rigged it did it in the last half hour before air.", reliability: "High" },
    { name: "Security Guard", statement: "Dana's badge shows her leaving the control room at 10:48 and swiping back in at 10:54 \u2014 six minutes unaccounted for.", reliability: "High" },
    { name: "Archive Room Coworker", statement: "Ines was right next to me pulling old tapes the entire half hour before the broadcast, I'd stake my job on it.", reliability: "High" }
  ],
  crimeScene: {
    location: "Rita Alvarez's Dressing Room, Channel 9 Studios",
    description: "The rigged microphone cable had its insulation deliberately stripped and wired into a nearby power strip, hidden under a towel on her vanity. Her laptop, open to a draft of the exposé, was still running.",
    details: [
      "The exposé draft on her laptop was last saved at 10:45 PM, seven minutes before her badge shows she returned from a coffee run.",
      "A maintenance requisition form for 'faulty wiring' in that exact dressing room had been filed and quietly approved earlier that week \u2014 by the executive producer's office.",
      "CCTV covering the dressing room hallway shows a five-minute static glitch precisely during the estimated time of the rigging."
    ]
  },
  evidence: [
    { id: "e1", type: "cctv", title: "Hallway Camera Glitch", description: "Five minutes of static on the dressing room hallway camera, timestamped 10:47\u201310:52 PM \u2014 the exact window of Dana's unaccounted badge gap." },
    { id: "e2", type: "document", title: "Maintenance Requisition Form", description: "Approved by Dana Kessler's office three days prior, authorizing 'wiring inspection' in Rita's dressing room \u2014 no inspection was ever logged as completed." },
    { id: "e3", type: "phone", title: "Rita's Phone Records", description: "Shows Rita called the network's legal department at 10:40 PM to schedule a meeting about her exposé 'first thing tomorrow.'" },
    { id: "e4", type: "document", title: "Exposé Draft", description: "Names Dana Kessler directly in a kickback scheme with a major advertiser, citing invoices as proof." },
    { id: "e5", type: "phone", title: "Badge Swipe Log", description: "Shows Dana leaving the control room at 10:48 PM and returning at 10:54 PM \u2014 the only unaccounted gap of the night among all staff." },
    { id: "e6", type: "photo", title: "Power Strip Photo", description: "The hidden power strip under the vanity towel, wired directly into the microphone cable's stripped insulation." },
    { id: "e7", type: "cctv", title: "Studio Floor Camera", description: "Confirms Trent Whitfield doing sound checks on set continuously from 10:30 to 11:00 PM, corroborated live." },
    { id: "e8", type: "receipt", title: "Restaurant Receipt", description: "Carl Alvarez's card was charged at a restaurant across town at 10:52 PM, matched by the waiter's statement." },
    { id: "e9", type: "document", title: "Archive Badge Log", description: "Ines Ortega's badge shows continuous presence in the archive room with no exits logged during the entire window." }
  ],
  timeline: [
    { time: "10:30 PM", event: "Sound technician confirms the microphone cable is functioning normally." },
    { time: "10:40 PM", event: "Rita calls the network's legal department to schedule a meeting about her exposé." },
    { time: "10:45 PM", event: "Rita's laptop last saves the exposé draft naming Dana Kessler." },
    { time: "10:47 PM", event: "The hallway CCTV camera outside Rita's dressing room glitches into static." },
    { time: "10:48 PM", event: "Dana Kessler's badge logs her leaving the control room." },
    { time: "10:52 PM", event: "Estimated time of the electrocution, based on the rigged cable's power draw log." },
    { time: "10:54 PM", event: "Dana's badge logs her returning to the control room." },
    { time: "10:58 PM", event: "Rita is found unresponsive minutes before the broadcast." }
  ],
  hiddenClues: [
    { id: "h1", relatedEvidence: "e2", description: "The maintenance requisition was approved by Dana's office specifically for Rita's dressing room, days before the murder \u2014 a pretext to justify the rigged wiring being found, or an excuse to access the room legitimately beforehand." },
    { id: "h2", relatedEvidence: "e1", description: "The hallway camera's static glitch lines up exactly with Dana's unaccounted six-minute badge gap, suggesting the same person who rigged the cable also tampered with the camera feed." },
    { id: "h3", relatedEvidence: "e3", description: "Rita's 10:40 PM call to legal, scheduling a meeting for 'first thing tomorrow,' means she intended to report the exposé within hours \u2014 giving Dana a hard deadline that explains why the murder happened that specific night." }
  ],
  accusation: {
    correctSuspectId: "s1",
    endings: {
      s1: {
        title: "Case Closed: Dead Air",
        success: true,
        text: "The badge gap, the camera glitch, and the conveniently-approved maintenance form all point the same direction. Dana Kessler used her authority to legitimize access to the dressing room, rigged the cable during the static blackout she engineered, and returned to the booth six minutes later as if nothing happened. Her exposure was hours away \u2014 now it's a headline of its own."
      },
      s2: {
        title: "Case Closed: A Rival Cleared",
        success: false,
        text: "You accuse Trent Whitfield. Live studio cameras and three crew members place him on set the entire time. The true culprit keeps her office and her badge access. The story dies with the accusation."
      },
      s3: {
        title: "Case Closed: An Intern's Reputation",
        success: false,
        text: "You accuse Ines Ortega. Her badge log shows continuous presence in the archive room, corroborated by a coworker. She loses her internship over the accusation anyway. The real killer keeps producing the show."
      },
      s4: {
        title: "Case Closed: An Alibi Across Town",
        success: false,
        text: "You accuse Carl Alvarez. The restaurant receipt and waiter's statement are ironclad. He loses custody of his son in the fallout of a false accusation, and the newsroom never learns who was really responsible."
      }
    }
  }
},

/* ---------------------------------------------------------- */
/* CASE 05                                                     */
/* ---------------------------------------------------------- */
{
  id: "last-auction",
  number: "005",
  title: "The Last Auction",
  difficulty: "Expert",
  tagline: "A masterpiece. A forgery. A body under the gavel.",
  story: [
    "The auction house of Verity & Sons was about to sell a 'rediscovered' Vermeer for eleven million dollars when its authenticator, Dr. Simon Feld, was found dead in the vault room \u2014 crushed under a falling display case that shouldn't have fallen.",
    "Simon had spent the week quietly testing the painting's provenance. His notes, half-burned in the vault's fireplace, suggest he found something that would have ended the sale, and perhaps a career or two.",
    "The auction is postponed. The killer is still holding a paddle."
  ],
  victim: {
    name: "Dr. Simon Feld",
    age: 63, occupation: "Art Authenticator",
    causeOfDeath: "Blunt force trauma (staged as an accident \u2014 rigged display case)",
    bio: "A meticulous authenticator whose reputation was his only asset. He'd flagged forgeries before, ending sales worth millions, and made no shortage of enemies among dealers and collectors who needed a sale to go through."
  },
  suspects: [
    {
      id: "s1", name: "Adrienne Verity", age: 52, occupation: "Auction House Owner",
      motive: "The sale's commission would save Verity & Sons from bankruptcy; Simon's findings would cancel it outright.",
      alibi: "Says she was in her office finalizing catalog copy \u2014 no witnesses for a twenty-minute window.",
      photo: "\u{1F469}\u200D\u{1F4BC}", guilty: false
    },
    {
      id: "s2", name: "Viktor Sorel", age: 58, occupation: "Art Forger (reformed, allegedly)",
      motive: "If the painting is proven forged, the trail could be traced back to Viktor's old workshop, exposing him despite his supposed retirement.",
      alibi: "Claims he was examining frames in the west gallery \u2014 a gallery attendant partially confirms it, but leaves a ten-minute gap.",
      photo: "\u{1F468}\u200D\u{1F3A8}", guilty: true
    },
    {
      id: "s3", name: "Beatrix Lowell", age: 61, occupation: "Rival Collector",
      motive: "Losing the bid to a forged painting would have been humiliating, but exposing the forgery publicly herself would boost her own reputation \u2014 unless Simon exposed it first and took the credit.",
      alibi: "Was in the vault room briefly to inspect the painting an hour before the murder, but confirmed at a luncheon at the time of death.",
      photo: "\u{1F469}\u200D\u{1F9B3}", guilty: false
    },
    {
      id: "s4", name: "Desmond Choi", age: 34, occupation: "Insurance Investigator",
      motive: "Simon's report would trigger a massive insurance payout dispute that Desmond's firm couldn't afford to lose.",
      alibi: "Badge access logs confirm he was in the records office reviewing files, corroborated by the archivist on duty.",
      photo: "\u{1F468}\u200D\u{1F4BB}", guilty: false
    }
  ],
  witnesses: [
    { name: "Gallery Attendant", statement: "Mr. Sorel was in the west gallery most of the afternoon, but he told me he needed to 'check something in storage' and was gone about ten minutes before the time of the incident.", reliability: "Medium" },
    { name: "Luncheon Host", statement: "Beatrix Lowell arrived at our table at least fifteen minutes before Simon was found, and never left our sight after that.", reliability: "High" },
    { name: "Records Archivist", statement: "Mr. Choi was reviewing insurance files with me the entire afternoon, we even argued about the appraisal figures.", reliability: "High" }
  ],
  crimeScene: {
    location: "The Vault Room, Verity & Sons Auction House",
    description: "The display case's mounting bracket had been loosened, not broken \u2014 a deliberate act, not wear. Simon's authentication notes were found half-burned in the vault's decorative fireplace, the surviving fragments legible under UV light.",
    details: [
      "The mounting bracket's screws show fresh tool marks, loosened with a specific type of jeweler's screwdriver.",
      "The burned notes reference 'pigment inconsistent with 17th century production' and a name: 'V.S.' cut off mid-sentence.",
      "A faint chemical residue on the vault door handle matches a solvent used in art restoration and forgery alike."
    ]
  },
  evidence: [
    { id: "e1", type: "photo", title: "Loosened Bracket Photo", description: "Close-up of the display case mounting bracket showing deliberate tool marks from a jeweler's screwdriver, not accidental wear." },
    { id: "e2", type: "document", title: "Burned Notes Fragment", description: "UV-recovered text reading: '...pigment inconsistent with 17th century production. Confronted V.S. about the...' \u2014 the rest is ash." },
    { id: "e3", type: "fingerprint", title: "Screwdriver Prints", description: "A jeweler's screwdriver found in a nearby supply closet carries partial prints, smudged but consistent with someone wearing thin cotton gloves \u2014 standard for handling paintings." },
    { id: "e4", type: "receipt", title: "Solvent Purchase Receipt", description: "A specialty art-restoration solvent purchased two weeks prior under the name 'V. Sorel Studio,' matching the residue on the vault door handle." },
    { id: "e5", type: "letter", title: "Old Correspondence", description: "A decades-old letter between Simon and a colleague, discussing an unnamed forger's 'unmistakable brushwork' that Simon claimed he'd recognize anywhere." },
    { id: "e6", type: "document", title: "Provenance File", description: "The painting's ownership history contains a decade-long gap conveniently filled by a private collector who has since passed away \u2014 impossible to verify." },
    { id: "e7", type: "photo", title: "Painting Pigment Photo", description: "A macro photograph of a paint sample showing a titanium white pigment not commercially available until the 20th century." },
    { id: "e8", type: "map", title: "Auction House Floor Plan", description: "Shows a service corridor connecting the west gallery directly to the vault room, bypassing the main floor entirely \u2014 a two-minute walk, not the ten minutes assumed." },
    { id: "e9", type: "document", title: "Viktor Sorel's Old Case File", description: "A sealed record of Viktor's forgery conviction twenty years prior, specializing in Dutch Golden Age reproductions \u2014 including, notably, Vermeer." }
  ],
  timeline: [
    { time: "1:00 PM", event: "Simon begins his final authentication pass on the painting in the vault room." },
    { time: "2:15 PM", event: "Beatrix Lowell briefly inspects the painting, then leaves for her luncheon." },
    { time: "2:40 PM", event: "Simon confronts someone referred to only as 'V.S.' in his notes, according to the burned fragment." },
    { time: "2:45 PM", event: "Viktor Sorel tells the gallery attendant he needs to 'check something in storage.'" },
    { time: "2:52 PM", event: "Estimated time of death, based on the vault room's dust settling pattern beneath the case." },
    { time: "2:55 PM", event: "Viktor returns to the west gallery, per the attendant." },
    { time: "3:10 PM", event: "Simon's body is discovered by a vault attendant during a routine check." }
  ],
  hiddenClues: [
    { id: "h1", relatedEvidence: "e8", description: "The service corridor connecting the west gallery to the vault room is a two-minute walk, not the assumed ten \u2014 which means Viktor's brief 'gap' in the west gallery was more than enough time to reach the vault, act, and return." },
    { id: "h2", relatedEvidence: "e9", description: "Viktor Sorel's sealed forgery conviction specifically involved Dutch Golden Age reproductions, including works attributed to Vermeer \u2014 the exact category of the painting in question." },
    { id: "h3", relatedEvidence: "e2", description: "The burned notes' fragment 'Confronted V.S. about the...' directly matches Viktor Sorel's initials, strongly suggesting Simon confronted him face-to-face shortly before the murder." }
  ],
  accusation: {
    correctSuspectId: "s2",
    endings: {
      s2: {
        title: "Case Closed: The Forger's Signature",
        success: true,
        text: "The service corridor timeline, the solvent receipt under his old studio name, and the burned note's initials leave no room for doubt. Viktor Sorel, never truly reformed, painted the 'Vermeer' himself decades ago. When Simon recognized the brushwork he'd once described as 'unmistakable,' Viktor silenced him rather than face a second conviction. The painting is seized as evidence; the auction never happens."
      },
      s1: {
        title: "Case Closed: A House in Ruins",
        success: false,
        text: "You accuse Adrienne Verity. Her motive was financial desperation, but no physical evidence places her at the scene. Verity & Sons collapses under the scandal regardless, and the true forger's masterpiece is never exposed."
      },
      s3: {
        title: "Case Closed: An Ironclad Luncheon",
        success: false,
        text: "You accuse Beatrix Lowell. A room full of luncheon guests confirms her whereabouts. Her reputation is damaged by the false accusation, and the real killer's forgery nearly goes to auction a second time under a different house."
      },
      s4: {
        title: "Case Closed: Filed and Forgotten",
        success: false,
        text: "You accuse Desmond Choi. The archivist's corroboration is airtight. His insurance firm pays out on a forged painting it never should have insured, and the true killer remains free to forge again."
      }
    }
  }
}

];

/* Convenience lookup */
function getCaseById(id) {
  return CASES.find(c => c.id === id);
}
