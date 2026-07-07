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

export interface OverviewView {
  id: string;
  label: string;
}

export const OVERVIEW_VIEWS: OverviewView[] = [
  { id: 'front', label: 'Front View' },
  { id: 'rear', label: 'Rear View' },
  { id: 'left', label: 'Left Side View' },
  { id: 'right', label: 'Right Side View' },
  { id: 'underhood', label: 'Underhood (Engine Bay)' },
  { id: 'interior', label: 'Inside Cabin' },
  { id: 'odometer', label: 'Odometer Display' },
  { id: 'keys', label: 'Duplicate Keys' },
  { id: 'vin', label: 'VIN Plate Stamp' },
];

export const CHECKLIST_TEMPLATES: ChecklistItemTemplate[] = [
  // Documents & Billing
  { 
    id: 'doc-invoice-price', 
    categoryId: 'documents', 
    label: 'Verify ex-showroom price on invoice matches manufacturer official website',
    description: 'Why: Dealers may sneak in inflated ex-showroom prices above the official MSRP, especially on popular models, costing you thousands extra.'
  },
  { 
    id: 'doc-rto-fees', 
    categoryId: 'documents', 
    label: 'Verify RTO tax, road tax, and registration fees against government sources',
    description: 'Why: Dealers frequently overcharge for road tax and registration, pocketing the difference. Always cross-check against the official government receipt.'
  },
  { 
    id: 'doc-insurance', 
    categoryId: 'documents', 
    label: 'Verify insurance details (correct IDV, zero-dep/RTI add-ons, NCB if transferred)',
    description: 'Why: Dealers markup insurance policies up to 50%. Ensuring IDV matches car cost and zero-depreciation is active prevents massive out-of-pocket claims.'
  },
  { 
    id: 'doc-extra-charges', 
    categoryId: 'documents', 
    label: 'Check for illegal handling/logistics charges, and ask to remove them',
    description: 'Why: Logistics/handling fees are officially declared illegal by courts and governments. Dealers add them as hidden profit margins.'
  },
  { 
    id: 'doc-spelling', 
    categoryId: 'documents', 
    label: 'Confirm your name and address are spelled 100% correctly on all documents',
    description: 'Why: A single spelling mistake on registration forms, tax invoices, or insurance documents can void insurance claims or delay registration.'
  },
  { 
    id: 'doc-specs-paper', 
    categoryId: 'documents', 
    label: 'Verify model, variant, engine/chassis number match between invoice, insurance, and Form 22',
    description: 'Why: Ensures the dealer does not register or insure a lower trim level by mistake, or deliver a variant different from what you paid for.'
  },
  { 
    id: 'doc-vin-paper', 
    categoryId: 'documents', 
    label: 'Physical VIN (chassis number) matches paperwork exactly',
    description: 'Why: If a single digit is mismatched, the car is legally not yours, and registration or insurance claims will be rejected.'
  },
  { 
    id: 'doc-engine-paper', 
    categoryId: 'documents', 
    label: 'Physical engine number or motor ID matches paperwork exactly',
    description: 'Why: Confirms that the physical engine block installed in the car is the same one registered on government databases, preventing legal issues.'
  },
  { 
    id: 'doc-stock-age', 
    categoryId: 'documents', 
    label: 'Decode VIN to verify manufacturing date and ensure it is not old stock',
    description: 'Why: Dealers push older inventory that has sat in open stockyards, suffering from paint oxidation, rusty brakes, and deep battery discharge.'
  },
  { 
    id: 'doc-must-have-check', 
    categoryId: 'documents', 
    label: 'Verify presence of Invoice, Sales Cert, Insurance, PUC, Manual, Service Book, and separate Warranties',
    description: 'Why: Third-party accessories (like batteries or tyres) have separate warranties from manufacturers. You need these physical cards to claim warranty.'
  },

  // Identity & Odometer
  { 
    id: 'id-specs', 
    categoryId: 'identity', 
    label: 'Verify engine type, transmission, safety kit (airbags), screen size, and wheels match booking',
    description: 'Why: Prevents variant bait-and-switch discrepancies (e.g., getting steel wheels instead of alloys or fewer airbags than booking specs).'
  },
  { 
    id: 'id-odo', 
    categoryId: 'identity', 
    label: 'Check odometer (ideal < 50 km, acceptable < 100 km, over 100 km is a red flag)',
    description: 'Why: High mileage (>100 km) suggests the vehicle was used as a test-drive car, dealer demo, or driven roughly between stockyards.'
  },
  { 
    id: 'id-wear', 
    categoryId: 'identity', 
    label: 'Look for signs of use: worn pedals, scuffed seats, front stone chips, or dirty tyre treads',
    description: 'Why: Confirms the car is brand new and not a refurbished demonstration unit or customer return that was cleaned up.'
  },
  { 
    id: 'id-records', 
    categoryId: 'identity', 
    label: 'Take backup photos of physical VIN plates, engine/motor numbers, and odometer readings',
    description: 'Why: Serves as absolute proof of the vehicle\'s original condition and identity should any discrepancies arise after you drive home.'
  },

  // Exterior & Paint
  { 
    id: 'ext-light-check', 
    categoryId: 'exterior', 
    label: 'Inspect outdoors in bright natural daylight (showroom lighting hides paint defects)',
    description: 'Why: Angled showroom spotlights are strategically placed to mask minor scratches, swirl marks, or repainted sections.'
  },
  { 
    id: 'ext-paint-flaws', 
    categoryId: 'exterior', 
    label: 'Check panels for paint scratches, color shade mismatches, overspray, or orange-peel textures',
    description: 'Why: Mismatched paint shades or rough overspray on rubber sealings indicate the panel was damaged and repainted in the dealer workshop.'
  },
  { 
    id: 'ext-high-risk-areas', 
    categoryId: 'exterior', 
    label: 'Carefully check bumper corners, roof edges, door edges, mirror covers, and handles',
    description: 'Why: These are the high-contact areas most likely to hit metal ramps or straps during truck loading and transit.'
  },
  { 
    id: 'ext-panel-gaps-verify', 
    categoryId: 'exterior', 
    label: 'Verify panel gaps are uniform and consistent left-to-right (no parts sticking out/sunk)',
    description: 'Why: Uneven gaps between panels indicate poor factory quality control or a panel that was replaced and misaligned after a yard accident.'
  },
  { 
    id: 'ext-doors-operation', 
    categoryId: 'exterior', 
    label: 'Verify doors, hood, and boot open/close smoothly with a solid thud and no grinding noises',
    description: 'Why: Hard opening or grinding indicates bent hinges or body misalignment, which leads to cabin rattles and water leaks.'
  },
  { 
    id: 'ext-beading-seals', 
    categoryId: 'exterior', 
    label: 'Check rubber door/window beadings are intact, soft, and properly seated',
    description: 'Why: Dry-rotted or loose rubber beadings let rainwater leak into the cabin and cause high cabin wind-noise levels at highway speeds.'
  },

  // Tyres, Wheels & Brakes
  { 
    id: 'tyre-spec-match', 
    categoryId: 'tyres', 
    label: 'Verify tyre brand, size (e.g. 195/60 R16), and type (tubeless/run-flat) match brochure specs',
    description: 'Why: Dealers sometimes swap premium tyre brands with cheaper alternatives before delivery. Verify all four wheels.'
  },
  { 
    id: 'tyre-mfg-date', 
    categoryId: 'tyres', 
    label: 'Check tyre manufacturing week/year on sidewalls (e.g. 2425) - must be recent and matching',
    description: 'Why: Rubber degrades with age even when sitting. Mismatched or old stock tyres (>6-12 months old) are prone to early cracks and high-speed blowouts.'
  },
  { 
    id: 'tyre-physical-check', 
    categoryId: 'tyres', 
    label: 'Inspect all tyres for cuts, bubbles, sidewall damage, or embedded nails',
    description: 'Why: Sidewall structural bubbles cannot be repaired and require full tyre replacement. This happens from rough loading on trucks.'
  },
  { 
    id: 'tyre-rims-rash', 
    categoryId: 'tyres', 
    label: 'Check alloy wheels/rims for curb rash, scratches, bends, or cracks',
    description: 'Why: Bends or cracks in alloys compromise tyre air seals. Curb rash indicates the vehicle hit a concrete block during yard transit.'
  },
  { 
    id: 'tyre-spare', 
    categoryId: 'tyres', 
    label: 'Verify spare wheel is present (or check for puncture inflator/sealant kit if vehicle has no spare)',
    description: 'Why: Many modern cars (especially EVs) omit a spare tyre. Ensure you receive the official compressor and sealant kit instead.'
  },
  { 
    id: 'tyre-tools', 
    categoryId: 'tyres', 
    label: 'Verify presence of jack, spanner, towing hook, and wheel lock key (if applicable)',
    description: 'Why: Standard tools are frequently missing or misplaced during dealer cleaning, leaving you stranded during a roadside puncture.'
  },
  { 
    id: 'tyre-pressure-adjust', 
    categoryId: 'tyres', 
    label: 'Have dealer adjust tyres to correct pressure (transport pressure is usually high)',
    description: 'Why: Vehicles ship at 45-50 PSI to prevent tyre flat-spots during transit. Driving at this pressure causes a harsh ride and braking issues.'
  },

  // Glass & Lights
  { 
    id: 'glass-cracks', 
    categoryId: 'glass_lights', 
    label: 'Check windscreen, side windows, rear windshield, and sunroof for chips or deep scratches',
    description: 'Why: Tiny windshield chips expand into massive cracks under thermal shock (hot sun or cold AC). Sunroof glass scratches leak water.'
  },
  { 
    id: 'lights-fogging', 
    categoryId: 'glass_lights', 
    label: 'Inspect lamp housings for cracks, broken clips, and moisture or fogging inside',
    description: 'Why: Water inside headlight housings shorts the high-voltage LED arrays. Moisture indicates a cracked seal that requires complete replacement.'
  },
  { 
    id: 'lights-test', 
    categoryId: 'glass_lights', 
    label: 'Test headlights (high/low), DRLs, indicators, brake/reverse/fog lights, and hazards',
    description: 'Why: Inoperative lights are safety hazards and point to blown fuses, wiring faults, or loose bulb sockets.'
  },
  { 
    id: 'glass-fittings', 
    categoryId: 'glass_lights', 
    label: 'Check ORVM housings, roof rails, and plastic cladding for secure, flush fitment',
    description: 'Why: Loose external trim panels or mirrors rattle at speed and can fly off on highways, presenting a safety hazard.'
  },

  // Engine & Fluids (ICE-Specific)
  { 
    id: 'eng-clean', 
    categoryId: 'engine', 
    label: 'Engine bay is clean, free of oil/coolant leaks, and excessive mud',
    description: 'Why: A dirty, muddy engine bay indicates the car was parked in water-clogged yards or used for unauthorized test drives.'
  },
  { 
    id: 'eng-fluids-levels', 
    categoryId: 'engine', 
    label: 'Check fluid levels: engine oil (dipstick), coolant reservoir, brake fluid, and windshield washer',
    description: 'Why: Low oil or coolant levels cause immediate engine overheating. Discolored oil suggests engine wear or testing usage.'
  },
  { 
    id: 'eng-wiring-check', 
    categoryId: 'engine', 
    label: 'Look for tangled or cut wires, non-OEM clamps, tape, or signs of rodent bite',
    description: 'Why: Rodents nesting in open stockyards often chew through wiring harnesses, leading to complex electrical failures later.'
  },
  {
    id: 'eng-fuel-exhaust-leak',
    categoryId: 'engine',
    label: 'Check for raw fuel smells (inside/outside cabin) and exhaust alignment',
    description: 'Why: Strong fuel smells indicate loose fuel lines or injector leaks, which are severe fire hazards.'
  },
  { 
    id: 'eng-ignition', 
    categoryId: 'engine', 
    label: 'Engine starts quickly, idles stably, with no metallic knocks or abnormal vibration',
    description: 'Why: Hard starting or rough idle indicates spark plug failure, bad fuel, or engine cylinder issues.'
  },
  { 
    id: 'eng-exhaust-smoke', 
    categoryId: 'engine', 
    label: 'Observe exhaust on startup for excessive black, blue, or white smoke',
    description: 'Why: Blue smoke means engine oil leak; white smoke suggests internal coolant leak (head gasket failure); black smoke means poor combustion.'
  },
  { 
    id: 'eng-drips', 
    categoryId: 'engine', 
    label: 'Inspect engine bay floor and underbody for fresh leaks/drips after running the engine',
    description: 'Why: Running the engine builds oil/coolant pressure. Fresh drips on the floor indicate loose gaskets or hose connections.'
  },

  // Battery & High-Voltage (EV-Specific)
  {
    id: 'ev-battery-health',
    categoryId: 'ev',
    label: 'Check battery State of Health (SoH) and verify no high-voltage warning lights are active',
    description: 'Why: EV batteries sitting at 0% charge in stockyards degrade quickly. A diagnostic health report ensures maximum battery life.'
  },
  { 
    id: 'ev-port-check', 
    categoryId: 'ev', 
    label: 'Charging port lid opens smoothly and internal socket pins are clean/undamaged',
    description: 'Why: Bent or corroded pins in the charging socket prevent fast DC charging or generate heating faults during AC charge sessions.'
  },
  { 
    id: 'ev-cables-bag', 
    categoryId: 'ev', 
    label: 'Charging cable is present, clean, undamaged, and inside its carrying bag',
    description: 'Why: EV portable chargers are high-cost components (up to $500/₹30,000) that can be stolen or misplaced in dealership storage.'
  },
  {
    id: 'ev-charging-demo',
    categoryId: 'ev',
    label: 'Request a live charging demonstration; confirm the handshakes and charging start without errors',
    description: 'Why: Verifies that the internal charger and cooling fans work under active load and communicate properly with charging guns.'
  },
  {
    id: 'ev-range-verify',
    categoryId: 'ev',
    label: 'Verify displayed range is consistent with battery SoC %; watch range stability on road test',
    description: 'Why: Wild drops in estimated range over a short drive point to defective battery cells or uncalibrated battery management systems.'
  },
  {
    id: 'ev-regen-braking',
    categoryId: 'ev',
    label: 'Verify regenerative braking controls and check transition smoothness during road test',
    description: 'Why: Ensures the EV recovers deceleration energy correctly and transitions smoothly between hydraulic pads and motor braking.'
  },
  {
    id: 'ev-thermal-mgmt',
    categoryId: 'ev',
    label: 'Check battery cooling/heating systems operation and verify AC range impact',
    description: 'Why: Battery thermal management is critical for EV safety. Excessive range drops when turning on AC suggest system inefficiency.'
  },
  {
    id: 'ev-warranty-docs',
    categoryId: 'ev',
    label: 'Confirm battery warranty (8 years / X km) and BMS service documentation are hand-delivered',
    description: 'Why: EV batteries are the most expensive part of the car. Having original, stamped warranty cards is non-negotiable for future claims.'
  },

  // Interior & Cabin
  { 
    id: 'int-general', 
    categoryId: 'interior', 
    label: 'Check seats, door pads, roof liner, dashboard, and carpets for stains, tears, or loose stitching',
    description: 'Why: Detailing chemicals or yard dirt can stain premium leather upholstery. Tears in roof liners are expensive to replace.'
  },
  { 
    id: 'int-water-leak', 
    categoryId: 'interior', 
    label: 'Lift floor mats to check underneath for dampness, mud, or water stains (flooding sign)',
    description: 'Why: Stagnant water under carpets causes rusted floorboard steel, moldy cabin air, and short circuits in bottom wiring harnesses.'
  },
  { 
    id: 'int-seats-move', 
    categoryId: 'interior', 
    label: 'Test all manual/electric seat adjustment controls for smooth, full range of motion',
    description: 'Why: Seat motor gears can bind or catch. Manual slide tracks need proper lubrication to adjust smoothly.'
  },
  { 
    id: 'int-belts', 
    categoryId: 'interior', 
    label: 'Verify all seat belts pull out smoothly, latch securely, and lock when jerked',
    description: 'Why: Seatbelts are primary lifesavers. A jammed retractor or failed lock means the car is unsafe to drive.'
  },
  { 
    id: 'int-glovebox', 
    categoryId: 'interior', 
    label: 'Verify glovebox (and cooled function), center storage, and armrests open/close properly',
    description: 'Why: Broken alignment latches on compartments cause annoying cabin squeaks and won\'t lock when parked.'
  },
  { 
    id: 'int-cabin-smell', 
    categoryId: 'interior', 
    label: 'Check for musty smells or foul odors coming from the HVAC vents',
    description: 'Why: Musty air conditioning smells indicate mold growth in the cabin filter or pooling water in the evaporator drain.'
  },

  // Electronics & AC
  { 
    id: 'elec-instrument', 
    categoryId: 'electronics', 
    label: 'Warning lights show on ignition and all clear completely after starting the engine',
    description: 'Why: Check engine, ABS, or airbag lights must turn off. Active lights point to critical sensor failures.'
  },
  { 
    id: 'elec-climate', 
    categoryId: 'electronics', 
    label: 'AC/heater cooling is fast and strong, check blower speeds, vent directions, and modes',
    description: 'Why: Faulty AC compressors or low refrigerant charge cause poor cooling. Blower fan defects make clicking sounds.'
  },
  { 
    id: 'elec-infotainment-test', 
    categoryId: 'electronics', 
    label: 'Infotainment touchscreen is responsive, test Bluetooth, Apple CarPlay, and Android Auto',
    description: 'Why: Infotainment units are complex computers. Screen lag, dead touch zones, or connection drops require full system replacement.'
  },
  { 
    id: 'elec-speakers-test', 
    categoryId: 'electronics', 
    label: 'Check balance/fader to ensure all speakers (front, rear, tweeters) function',
    description: 'Why: Blown speaker cones rattle at normal volumes. Incorrect factory wiring can leave some speakers disconnected.'
  },
  { 
    id: 'elec-controls-switches', 
    categoryId: 'electronics', 
    label: 'Test all power windows (auto up/down), central locking, ORVM fold/adjust, and map/boot lights',
    description: 'Why: Sticky windows suggest motor strain or misaligned tracks. Failed locks leave the car vulnerable to theft.'
  },
  { 
    id: 'elec-wipers-washer', 
    categoryId: 'electronics', 
    label: 'Test front/rear wipers, washer spray, and all speed settings',
    description: 'Why: Dry wiper rubber streaks or scratches the windshield. Clogged washer nozzles make driving in dirt unsafe.'
  },
  { 
    id: 'elec-obd-scanner', 
    categoryId: 'electronics', 
    label: 'Optional: Connect OBD-II scanner to verify there are no hidden diagnostic trouble codes (DTCs)',
    description: 'Why: Dealerships can clear dashboard warning codes temporarily. An OBD scanner reads deep ECU registers for active history faults.'
  },

  // Road Test & Drive
  { 
    id: 'road-response', 
    categoryId: 'road_test', 
    label: 'Engine/Motor acceleration is smooth with no flat spots, hesitation, or jerking',
    description: 'Why: Power delivery lag suggests transmission slippage, fuel injection faults, or motor calibration issues.'
  },
  { 
    id: 'road-steering-pull', 
    categoryId: 'road_test', 
    label: 'At 60 km/h on a level road, car tracks straight and doesn\'t pull to the left/right',
    description: 'Why: Wheel pulling indicates bad alignment, uneven tyre pressure, or suspension damage from yard transport impacts.'
  },
  { 
    id: 'road-steering-noise', 
    categoryId: 'road_test', 
    label: 'Turn steering fully left/right at low speed - check for metallic grinding or cracking noises',
    description: 'Why: Grinding at full lock points to steering rack defects or damaged constant velocity (CV) joints.'
  },
  { 
    id: 'road-brake-feel', 
    categoryId: 'road_test', 
    label: 'Brake pedal feels firm and progressive, car brakes straight without vibration or shudder',
    description: 'Why: Pedal shuddering under braking indicates warped brake rotors, which requires grinding or complete replacement.'
  },
  { 
    id: 'road-suspension', 
    categoryId: 'road_test', 
    label: 'Drive over bumps - check for suspension squeaks, rattles, or loose metallic thuds',
    description: 'Why: Squeaking points to dry rubber bushings; heavy metallic thuds indicate leaking shock absorbers or loose stabilizer links.'
  },
  { 
    id: 'road-transmission', 
    categoryId: 'road_test', 
    label: 'Verify gear shifts (manual/automatic) are smooth; test paddles or EV creep settings',
    description: 'Why: Jerking during gear changes indicates low transmission oil or controller module faults.'
  },

  // Accessories & Keys
  { 
    id: 'acc-verify', 
    categoryId: 'accessories', 
    label: 'Check all promised accessories (mats, mud flaps, seat covers, dashcam, body kits) are installed',
    description: 'Why: Ensure you get everything you paid for in your booking invoice. Dealers forget accessories in rush hours.'
  },
  { 
    id: 'acc-quality-oem', 
    categoryId: 'accessories', 
    label: 'Ensure accessories are OEM/agreed brands and match the invoice specs without downgrades',
    description: 'Why: Dealers sometimes install cheaper aftermarket components instead of genuine OEM kits while charging full price.'
  },
  { 
    id: 'acc-safety-kit', 
    categoryId: 'accessories', 
    label: 'Verify presence of first-aid kit, warning triangle, and tyre inflator (if no spare)',
    description: 'Why: Mandatory roadside safety equipment is often skipped by pre-delivery inspection teams.'
  },
  { 
    id: 'acc-all-keys', 
    categoryId: 'accessories', 
    label: 'Confirm presence of all keys (usually 2 remotes/fobs); verify each locks, unlocks, and starts',
    description: 'Why: Smart keys cost up to $300/₹20,000 to replace. Ensure both keys are programmed to your engine immobilizer.'
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

