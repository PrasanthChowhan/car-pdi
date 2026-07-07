export interface ChecklistItemTemplate {
  id: string;
  categoryId: string;
  label: string;
  description?: string; // Optional beginner-friendly hint or explanation
}

export interface Category {
  id: string;
  label: string;
}

export const CATEGORIES: Category[] = [
  { id: 'documents', label: 'Documents & Billing' },
  { id: 'identity', label: 'Identity & Odometer' },
  { id: 'exterior', label: 'Exterior & Paint' },
  { id: 'tyres', label: 'Tyres, Wheels & Brakes' },
  { id: 'glass_lights', label: 'Glass & Lights' },
  { id: 'engine', label: 'Engine & Fluids (ICE-Specific)' },
  { id: 'ev', label: 'Battery & High-Voltage (EV-Specific)' },
  { id: 'interior', label: 'Interior & Cabin' },
  { id: 'electronics', label: 'Electronics & AC' },
  { id: 'road_test', label: 'Road Test & Drive' },
  { id: 'accessories', label: 'Accessories & Keys' },
];

export const CHECKLIST_TEMPLATES: ChecklistItemTemplate[] = [
  // Documents & Billing
  { 
    id: 'doc-invoice-price', 
    categoryId: 'documents', 
    label: 'Verify ex-showroom price on invoice matches manufacturer official website',
    description: 'Ensure the base car price matches official manufacturer listings. Reject forced dealer markups.'
  },
  { 
    id: 'doc-rto-fees', 
    categoryId: 'documents', 
    label: 'Verify RTO tax, road tax, and registration fees against government sources',
    description: 'RTO = Regional Transport Office. Check official state calculators; dealers often add illegal hidden handling markups here.'
  },
  { 
    id: 'doc-insurance', 
    categoryId: 'documents', 
    label: 'Verify insurance details (correct IDV, zero-dep/RTI add-ons, NCB if transferred)',
    description: 'IDV (Insured Declared Value) should equal the car price. Check Zero-Depreciation and Return-to-Invoice (RTI) coverage.'
  },
  { 
    id: 'doc-extra-charges', 
    categoryId: 'documents', 
    label: 'Check for illegal handling/logistics charges, and ask to remove them',
    description: 'Logistics/handling fees are illegal in most regions. Demand their removal before signing or making final payment.'
  },
  { 
    id: 'doc-spelling', 
    categoryId: 'documents', 
    label: 'Confirm your name and address are spelled 100% correctly on all documents',
    description: 'A single typo on the invoice, registration form, or insurance card can void claims or delay registration.'
  },
  { 
    id: 'doc-specs-paper', 
    categoryId: 'documents', 
    label: 'Verify model, variant, engine/chassis number match between invoice, insurance, and Form 22',
    description: 'Form 22 is the manufacturer road-worthiness certification. The variant (e.g. Luxury vs Sport) must match booking.'
  },
  { 
    id: 'doc-vin-paper', 
    categoryId: 'documents', 
    label: 'Physical VIN (chassis number) matches paperwork exactly',
    description: 'Locate the 17-character VIN plate on the windshield base or door pillar. Every digit must match the invoice.'
  },
  { 
    id: 'doc-engine-paper', 
    categoryId: 'documents', 
    label: 'Physical engine number or motor ID matches paperwork exactly',
    description: 'Verify physical stamps match the Form 22 and sales certificate. For EVs, verify motor ID is correct.'
  },
  { 
    id: 'doc-stock-age', 
    categoryId: 'documents', 
    label: 'Decode VIN to verify manufacturing date and ensure it is not old stock',
    description: 'Dealers sometimes push old stock. Use online VIN decoders; ensure the car is less than 2-3 months old.'
  },
  { 
    id: 'doc-must-have-check', 
    categoryId: 'documents', 
    label: 'Verify presence of Invoice, Sales Cert, Insurance, PUC, Manual, Service Book, and separate Warranties',
    description: 'Ensure you get: Original Invoice, Form 21 (Sales Cert), Insurance policy, PUC (where applicable), Owner\'s Manual, stamped Service Book, and separate warranty cards for the third-party Battery and Tyres.'
  },

  // Identity & Odometer
  { 
    id: 'id-specs', 
    categoryId: 'identity', 
    label: 'Verify engine type, transmission, safety kit (airbags), screen size, and wheels match booking',
    description: 'Inspect the actual car layout to prevent variant bait-and-switch scams (e.g., steel wheels instead of alloys).'
  },
  { 
    id: 'id-odo', 
    categoryId: 'identity', 
    label: 'Check odometer (ideal < 50 km, acceptable < 100 km, over 100 km is a red flag)',
    description: 'Odometer should show minimal yard movement. High mileage indicates the car was used as a test-drive unit.'
  },
  { 
    id: 'id-wear', 
    categoryId: 'identity', 
    label: 'Look for signs of use: worn pedals, scuffed seats, front stone chips, or dirty tyre treads',
    description: 'Verify the car is truly brand new and has not been detailed over to hide previous customer or showroom demo use.'
  },
  { 
    id: 'id-records', 
    categoryId: 'identity', 
    label: 'Take backup photos of physical VIN plates, engine/motor numbers, and odometer readings',
    description: 'Keep these photos on your phone as permanent evidence of the vehicle identity before taking possession.'
  },

  // Exterior & Paint
  { 
    id: 'ext-light-check', 
    categoryId: 'exterior', 
    label: 'Inspect outdoors in bright natural daylight (showroom lighting hides paint defects)',
    description: 'Showroom spot-lights are angled specifically to hide minor dents, sanding marks, and color-matching repaints.'
  },
  { 
    id: 'ext-paint-flaws', 
    categoryId: 'exterior', 
    label: 'Check panels for paint scratches, color shade mismatches, overspray, or orange-peel textures',
    description: 'Look closely at angles. Mismatched shades or rough overspray on rubber sealings indicates transit repairs.'
  },
  { 
    id: 'ext-high-risk-areas', 
    categoryId: 'exterior', 
    label: 'Carefully check bumper corners, roof edges, door edges, mirror covers, and handles',
    description: 'These are the most common areas scratched during truck loading and unloading.'
  },
  { 
    id: 'ext-panel-gaps-verify', 
    categoryId: 'exterior', 
    label: 'Verify panel gaps are uniform and consistent left-to-right (no parts sticking out/sunk)',
    description: 'Uneven gaps between the hood, doors, or boot indicate alignment issues or previous panel damage.'
  },
  { 
    id: 'ext-doors-operation', 
    categoryId: 'exterior', 
    label: 'Verify doors, hood, and boot open/close smoothly with a solid thud and no grinding noises',
    description: 'Listen for friction, hinges catching, or clicking. Everything should align cleanly.'
  },
  { 
    id: 'ext-beading-seals', 
    categoryId: 'exterior', 
    label: 'Check rubber door/window beadings are intact, soft, and properly seated',
    description: 'Look for dry-rotting or loose sealing which causes cabin water leaks and high wind-noise levels later.'
  },

  // Tyres, Wheels & Brakes
  { 
    id: 'tyre-spec-match', 
    categoryId: 'tyres', 
    label: 'Verify tyre brand, size (e.g. 195/60 R16), and type (tubeless/run-flat) match brochure specs',
    description: 'Dealers sometimes swap premium tyres with cheaper brands before delivery. Check all four tyres.'
  },
  { 
    id: 'tyre-mfg-date', 
    categoryId: 'tyres', 
    label: 'Check tyre manufacturing week/year on sidewalls (e.g. 2425) - must be recent and matching',
    description: 'Look for a 4-digit code on the tyre wall (e.g., 2425 means 24th week of 2025). Old tyres degrade and blow out.'
  },
  { 
    id: 'tyre-physical-check', 
    categoryId: 'tyres', 
    label: 'Inspect all tyres for cuts, bubbles, sidewall damage, or embedded nails',
    description: 'Transit damage on tyre sidewalls cannot be repaired; check the inner and outer tyre walls.'
  },
  { 
    id: 'tyre-rims-rash', 
    categoryId: 'tyres', 
    label: 'Check alloy wheels/rims for curb rash, scratches, bends, or cracks',
    description: 'Damage occurs during yard transit or parking. Scratched alloy rims are expensive to replace.'
  },
  { 
    id: 'tyre-spare', 
    categoryId: 'tyres', 
    label: 'Verify spare wheel is present (or check for puncture inflator/sealant kit if vehicle has no spare)',
    description: 'Many modern vehicles (especially EVs) omit a physical spare wheel to save weight. In this case, verify the official tyre mobility compressor/sealant kit is present in the boot.'
  },
  { 
    id: 'tyre-tools', 
    categoryId: 'tyres', 
    label: 'Verify presence of jack, spanner, towing hook, and wheel lock key (if applicable)',
    description: 'Locate the puncture repair kit or physical tool pouch in the boot floor. Verify no tools are missing.'
  },
  { 
    id: 'tyre-pressure-adjust', 
    categoryId: 'tyres', 
    label: 'Have dealer adjust tyres to correct pressure (transport pressure is usually high)',
    description: 'Vehicles ship overseas at 40-50 PSI. Check driver-door sticker; ask to bleed them to standard (usually 32-35 PSI).'
  },

  // Glass & Lights
  { 
    id: 'glass-cracks', 
    categoryId: 'glass_lights', 
    label: 'Check windscreen, side windows, rear windshield, and sunroof for chips or deep scratches',
    description: 'Run your fingernail over small dots. Even a minor chip can crack under thermal shock.'
  },
  { 
    id: 'lights-fogging', 
    categoryId: 'glass_lights', 
    label: 'Inspect lamp housings for cracks, broken clips, and moisture or fogging inside',
    description: 'Water drops inside headlights indicate a broken seal. Demand replacement, not drying.'
  },
  { 
    id: 'lights-test', 
    categoryId: 'glass_lights', 
    label: 'Test headlights (high/low), DRLs, indicators, brake/reverse/fog lights, and hazards',
    description: 'DRLs = Daytime Running Lights. Check auto-headlights and cornering light functions if equipped.'
  },
  { 
    id: 'glass-fittings', 
    categoryId: 'glass_lights', 
    label: 'Check ORVM housings, roof rails, and plastic cladding for secure, flush fitment',
    description: 'ORVM = Outer Rear View Mirror. Gently shake roof rails to ensure mounting bolts are solid.'
  },

  // Engine & Fluids (ICE-Specific)
  { 
    id: 'eng-clean', 
    categoryId: 'engine', 
    label: 'Engine bay is clean, free of oil/coolant leaks, and excessive mud',
    description: 'A dirty engine bay on a new car indicates flood storage or test use. Check corners for grease deposits.'
  },
  { 
    id: 'eng-fluids-levels', 
    categoryId: 'engine', 
    label: 'Check fluid levels: engine oil (dipstick), coolant reservoir, brake fluid, and windshield washer',
    description: 'Fluid levels should rest between MIN and MAX. Oil should be clear honey-colored, not dark brown.'
  },
  { 
    id: 'eng-wiring-check', 
    categoryId: 'engine', 
    label: 'Look for tangled or cut wires, non-OEM clamps, tape, or signs of rodent bite',
    description: 'Check exposed wires for bite marks or electrical tape fixes. Rats nesting in stockyards is very common.'
  },
  {
    id: 'eng-fuel-exhaust-leak',
    categoryId: 'engine',
    label: 'Check for raw fuel smells (inside/outside cabin) and exhaust alignment',
    description: 'Ensure there is no raw gasoline/diesel smell. Check that the exhaust pipe is properly aligned and not hanging low.'
  },
  { 
    id: 'eng-ignition', 
    categoryId: 'engine', 
    label: 'Engine starts quickly, idles stably, with no metallic knocks or abnormal vibration',
    description: 'Cold-start the engine. The idle RPM should settle smoothly within a minute without hunting.'
  },
  { 
    id: 'eng-exhaust-smoke', 
    categoryId: 'engine', 
    label: 'Observe exhaust on startup for excessive black, blue, or white smoke',
    description: 'Blue smoke = burning oil; white smoke = coolant leak; thick black smoke = fuel mix issue.'
  },
  { 
    id: 'eng-drips', 
    categoryId: 'engine', 
    label: 'Inspect engine bay floor and underbody for fresh leaks/drips after running the engine',
    description: 'Look under the front chassis after test running. Condensation from AC is normal; oil, green, or red fluid is a leak.'
  },

  // Battery & High-Voltage (EV-Specific)
  {
    id: 'ev-battery-health',
    categoryId: 'ev',
    label: 'Check battery State of Health (SoH) and verify no high-voltage warning lights are active',
    description: 'Request a copy of the battery diagnostic report from the dealership. Confirm the BMS (Battery Management System) has no active fault codes.'
  },
  { 
    id: 'ev-port-check', 
    categoryId: 'ev', 
    label: 'Charging port lid opens smoothly and internal socket pins are clean/undamaged',
    description: 'Inspect the charging port (CCS or Type 2 connector) for bent pins, moisture, or dust accumulation.'
  },
  { 
    id: 'ev-cables-bag', 
    categoryId: 'ev', 
    label: 'Charging cable is present, clean, undamaged, and inside its carrying bag',
    description: 'Locate the portable charging cable (EVSE). Check that the plugs and cables have no cuts or exposed wires.'
  },
  {
    id: 'ev-charging-demo',
    categoryId: 'ev',
    label: 'Request a live charging demonstration; confirm the handshakes and charging start without errors',
    description: 'Plug the vehicle into an active charger at the dealership. Confirm it initiates charging and shows details on screen.'
  },
  {
    id: 'ev-range-verify',
    categoryId: 'ev',
    label: 'Verify displayed range is consistent with battery SoC %; watch range stability on road test',
    description: 'Check that range projection is logical for the current battery level. Monitor for wild estimated range drops.'
  },
  {
    id: 'ev-regen-braking',
    categoryId: 'ev',
    label: 'Verify regenerative braking controls and check transition smoothness during road test',
    description: 'Toggle through different regen levels (e.g. single-pedal drive, low, high). Ensure transition is smooth.'
  },
  {
    id: 'ev-thermal-mgmt',
    categoryId: 'ev',
    label: 'Check battery cooling/heating systems operation and verify AC range impact',
    description: 'Turn on climate control and verify fans or thermal management indicators on screen operate without massive range penalties.'
  },
  {
    id: 'ev-warranty-docs',
    categoryId: 'ev',
    label: 'Confirm battery warranty (8 years / X km) and BMS service documentation are hand-delivered',
    description: 'Ensure you receive physical stamped documents specifically detailing the high-voltage battery pack coverage.'
  },

  // Interior & Cabin
  { 
    id: 'int-general', 
    categoryId: 'interior', 
    label: 'Check seats, door pads, roof liner, dashboard, and carpets for stains, tears, or loose stitching',
    description: 'Ensure plastic covers are removed in front of you so you can verify the seats underneath are clean.'
  },
  { 
    id: 'int-water-leak', 
    categoryId: 'interior', 
    label: 'Lift floor mats to check underneath for dampness, mud, or water stains (flooding sign)',
    description: 'Press your hand deep into the floor carpet. Dampness points to window sealing failure or yard flooding.'
  },
  { 
    id: 'int-seats-move', 
    categoryId: 'interior', 
    label: 'Test all manual/electric seat adjustment controls for smooth, full range of motion',
    description: 'Check lumber support, seat heating, or cooling fans if equipped. Verify seat rails are greased.'
  },
  { 
    id: 'int-belts', 
    categoryId: 'interior', 
    label: 'Verify all seat belts pull out smoothly, latch securely, and lock when jerked',
    description: 'Yank each belt quickly. It must lock immediately. This is a critical life-saving safety component.'
  },
  { 
    id: 'int-glovebox', 
    categoryId: 'interior', 
    label: 'Verify glovebox (and cooled function), center storage, and armrests open/close properly',
    description: 'Check alignment of latches. Sun visors, sunglasses holders, and cup holders should lock in place.'
  },
  { 
    id: 'int-cabin-smell', 
    categoryId: 'interior', 
    label: 'Check for musty smells or foul odors coming from the HVAC vents',
    description: 'HVAC = Heating, Ventilation, and Air Conditioning. A moldy smell indicates stagnant water in the cabin filter.'
  },

  // Electronics & AC
  { 
    id: 'elec-instrument', 
    categoryId: 'electronics', 
    label: 'Warning lights show on ignition and all clear completely after starting the engine',
    description: 'All system lights (ABS, Airbags, etc.) illuminate on key turn; they must turn off 2 seconds after engine start or EV power-on.'
  },
  { 
    id: 'elec-climate', 
    categoryId: 'electronics', 
    label: 'AC/heater cooling is fast and strong, check blower speeds, vent directions, and modes',
    description: 'Set climate control to minimum temperature. Cold air must flow within 30 seconds. Verify defogger functions.'
  },
  { 
    id: 'elec-infotainment-test', 
    categoryId: 'electronics', 
    label: 'Infotainment touchscreen is responsive, test Bluetooth, Apple CarPlay, and Android Auto',
    description: 'Connect your phone; check for dead touch zones, screen flickering, or system crashes.'
  },
  { 
    id: 'elec-speakers-test', 
    categoryId: 'electronics', 
    label: 'Check balance/fader to ensure all speakers (front, rear, tweeters) function',
    description: 'Adjust audio position on-screen to each corner; make sure no speaker sounds distorted or buzzing.'
  },
  { 
    id: 'elec-controls-switches', 
    categoryId: 'electronics', 
    label: 'Test all power windows (auto up/down), central locking, ORVM fold/adjust, and map/boot lights',
    description: 'Ensure anti-pinch functions work on windows. Boot and glovebox illumination should turn on.'
  },
  { 
    id: 'elec-wipers-washer', 
    categoryId: 'electronics', 
    label: 'Test front/rear wipers, washer spray, and all speed settings',
    description: 'Check that wipers sweep cleanly without juddering or scratching. Verify washer nozzles align properly.'
  },
  { 
    id: 'elec-obd-scanner', 
    categoryId: 'electronics', 
    label: 'Optional: Connect OBD-II scanner to verify there are no hidden diagnostic trouble codes (DTCs)',
    description: 'OBD = On-Board Diagnostics. An OBD reader can find hidden engine codes that the cluster fails to show.'
  },

  // Road Test & Drive
  { 
    id: 'road-response', 
    categoryId: 'road_test', 
    label: 'Engine/Motor acceleration is smooth with no flat spots, hesitation, or jerking',
    description: 'Under light and moderate acceleration, check that power delivery is linear and smooth without whine, slippage, or clunks.'
  },
  { 
    id: 'road-steering-pull', 
    categoryId: 'road_test', 
    label: 'At 60 km/h on a level road, car tracks straight and doesn\'t pull to the left/right',
    description: 'Briefly lift hands off the wheel. If the car pulls to either side, alignment or suspension is damaged.'
  },
  { 
    id: 'road-steering-noise', 
    categoryId: 'road_test', 
    label: 'Turn steering fully left/right at low speed - check for metallic grinding or cracking noises',
    description: 'Grinding at lock points indicating suspension mount wear or steering rack steering failure.'
  },
  { 
    id: 'road-brake-feel', 
    categoryId: 'road_test', 
    label: 'Brake pedal feels firm and progressive, car brakes straight without vibration or shudder',
    description: 'Shuddering through the pedal indicates warped brake rotors. Braking should be silent and immediate.'
  },
  { 
    id: 'road-suspension', 
    categoryId: 'road_test', 
    label: 'Drive over bumps - check for suspension squeaks, rattles, or loose metallic thuds',
    description: 'Listen closely with windows down. Squeaks indicate dry bushings; heavy thuds indicate shock absorber leak.'
  },
  { 
    id: 'road-transmission', 
    categoryId: 'road_test', 
    label: 'Verify gear shifts (manual/automatic) are smooth; test paddles or EV creep settings',
    description: 'Clutch should be light. Automatics should not slip/jerk. EVs should creep smoothly in D/R.'
  },

  // Accessories & Keys
  { 
    id: 'acc-verify', 
    categoryId: 'accessories', 
    label: 'Check all promised accessories (mats, mud flaps, seat covers, dashcam, body kits) are installed',
    description: 'Cross-check the booking invoice add-ons. Ensure all paid accessories are physically on the car.'
  },
  { 
    id: 'acc-quality-oem', 
    categoryId: 'accessories', 
    label: 'Ensure accessories are OEM/agreed brands and match the invoice specs without downgrades',
    description: 'OEM = Original Equipment Manufacturer. Check that the dealer did not install cheap aftermarket substitutes.'
  },
  { 
    id: 'acc-safety-kit', 
    categoryId: 'accessories', 
    label: 'Verify presence of first-aid kit, warning triangle, and tyre inflator (if no spare)',
    description: 'Examine expiry date on first aid creams. Ensure high-visibility warning triangle clips are working.'
  },
  { 
    id: 'acc-all-keys', 
    categoryId: 'accessories', 
    label: 'Confirm presence of all keys (usually 2 remotes/fobs); verify each locks, unlocks, and starts',
    description: 'Verify both key fobs are programmed. Lost keys are extremely expensive to program and replace later.'
  },
];

export const CATEGORY_DEFECT_SUGGESTIONS: Record<string, string[]> = {
  documents: [
    'Spelling error on invoice/insurance name',
    'Base ex-showroom price is higher than online MSRP',
    'Forced/illegal handling or logistics fees included',
    'Insurance details incorrect (wrong variant/IDV/zero-dep)',
    'VIN or engine number mismatch on paperwork',
    'Missing manual, service book, or component warranty card',
  ],
  identity: [
    'Odometer mileage is too high (> 100 km)',
    'Worn pedals, scuffed floor, or interior signs of use',
    'Variant/trim is incorrect (different specs/wheels)',
    'VIN stamp on windshield/chassis differs from invoice',
  ],
  exterior: [
    'Paint scratch or paint chip found',
    'Body panel dent or dimple',
    'Uneven/wide panel gaps',
    'Door, hood, or boot squeaking/rubbing',
    'Rubber window/door beading loose or torn',
    'Color mismatch between bumper and body panels',
  ],
  tyres: [
    'Scratch/curb rash on alloy wheel rim',
    'Tyre manufacturing week is too old (> 6 months)',
    'Tyre sidewall cut, bulge, or nail puncture',
    'Tyre pressure is way too high (> 40 PSI)',
    'Missing spare wheel, jack, spanner, or towing hook',
  ],
  glass_lights: [
    'Windshield/sunroof glass chip or deep scratch',
    'Water condensation/fogging inside headlight casing',
    'Inoperative headlight, indicator, tail, or reverse light',
    'Roof rails or mirror caps loose/rattling',
  ],
  engine: [
    'Engine oil or coolant level below minimum limit',
    'Engine oil is dark/dirty (suspect test unit)',
    'Active fluid leak/drips under engine bay',
    'Rodent bite marks or cut insulation under hood',
    'Abnormal ticking, knocking, or heavy idle vibration',
  ],
  ev: [
    'Battery State of Health (SoH) report not provided',
    'Charging port flap sticky or pins bent/dirty',
    'Charging cable/adapter missing or damaged',
    'Range estimate on dash inconsistent with SoC %',
    'Regenerative braking feels jerky or non-functional',
  ],
  interior: [
    'Stain, scratch, or loose stitching on seat/headliner',
    'Rattle-prone or loose trim panel on door/dashboard',
    'Seat slide/recline controls stiff or inoperative',
    'Seatbelt retractors slow/jammed',
    'Glovebox latch sticky or broken',
  ],
  electronics: [
    'AC is not cooling or AC blower makes a high-pitched whine',
    'Infotainment touchscreen lags, freezes, or fails to boot',
    'USB/Type-C ports or wireless charging pad dead',
    'Speakers crackle or audio balance is uneven',
    'Reverse camera screen is blurry or static',
  ],
  road_test: [
    'Vehicle pulls to left/right at highway speeds',
    'Brake pedal vibrates or squeals under moderate stopping',
    'Clunking or metal-on-metal thuds from suspension over bumps',
    'Gearbox changes feel clunky or hesitate',
  ],
  accessories: [
    'Missing second key fob/smart key remote',
    'Missing floor mats or mud flaps (paid add-on)',
    'First aid kit or safety warning triangle missing',
  ]
};

export const ITEM_DEFECT_SUGGESTIONS: Record<string, string[]> = {
  'doc-spelling': [
    'Owner name spelled incorrectly on invoice',
    'Residential address typo on registration documents',
    'VIN digit typed wrong in insurance certificate',
  ],
  'id-odo': [
    'Odometer mileage is excessively high',
    'Trip meter or dashboard buttons not functioning',
  ],
  'ext-paint-flaws': [
    'Swirl marks or buffer trails visible in daylight',
    'Deep scratch exposing primer on door panel',
    'Paint chip from transit damage on bumper edge',
    'Mismatched paint color shade on repainted fender',
  ],
  'tyre-mfg-date': [
    'Tyre manufacturing code shows date is over 6 months old',
    'Tyres show different manufacturing weeks (mismatched set)',
  ],
  'glass-cracks': [
    'Tiny crack/stone chip in front windscreen',
    'Scratch marks on sunroof glass',
    'Rear windshield heater elements scratched/cut',
  ],
  'lights-fogging': [
    'Severe condensation inside left headlamp casing',
    'Water droplets visible inside fog lamp housing',
  ],
  'eng-wiring-check': [
    'Rodent chew marks on battery ground wire',
    'Non-OEM electrical tape wrap on engine wiring harness',
  ],
  'electronics-ac': [
    'AC blower works but only blows ambient air',
    'Musty/foul odor from AC vents when turned on',
    'AC blower fan clicks loudly at high speeds',
  ]
};

