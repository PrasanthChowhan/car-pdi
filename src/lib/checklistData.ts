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
    label: 'Check if the base car price on your bill matches the official website price',
    description: 'Why: Sometimes dealers quietly add extra money to the starting price, making you pay more.'
  },
  { 
    id: 'doc-rto-fees', 
    categoryId: 'documents', 
    label: 'Check if road tax and registration fees match official government rates',
    description: 'Why: Dealers sometimes overcharge for taxes. Always ask for the official government receipt.'
  },
  { 
    id: 'doc-insurance', 
    categoryId: 'documents', 
    label: 'Check insurance details (car value is correct, full bumper-to-bumper cover included)',
    description: 'Why: Making sure your car is fully covered at its actual value saves you money if there is an accident.'
  },
  { 
    id: 'doc-extra-charges', 
    categoryId: 'documents', 
    label: 'Look for "handling" or "logistics" charges on the bill and ask to remove them',
    description: 'Why: These extra fees are not legally allowed. Dealers sometimes add them just for extra profit.'
  },
  { 
    id: 'doc-spelling', 
    categoryId: 'documents', 
    label: 'Make sure your name and address are spelled perfectly on all papers',
    description: 'Why: A small spelling mistake can cause big problems with your insurance or car registration later.'
  },
  { 
    id: 'doc-specs-paper', 
    categoryId: 'documents', 
    label: 'Check that the car model and features on the papers match exactly what you ordered',
    description: 'Why: This makes sure you are actually getting the exact car and features you paid for.'
  },
  { 
    id: 'doc-vin-paper', 
    categoryId: 'documents', 
    label: 'Check that the car\'s unique ID number (VIN) on the car matches your papers perfectly',
    description: 'Why: If even one number is wrong, the car isn\'t legally yours and you could face insurance issues.'
  },
  { 
    id: 'doc-engine-paper', 
    categoryId: 'documents', 
    label: 'Check that the engine number on the engine itself matches your papers perfectly',
    description: 'Why: This proves the engine in your car is the one the government has on record for you.'
  },
  { 
    id: 'doc-stock-age', 
    categoryId: 'documents', 
    label: 'Check the car\'s build date to make sure it hasn\'t been sitting at the dealer for too long',
    description: 'Why: Cars sitting outdoors for months can develop paint issues, rust, or weak batteries.'
  },
  { 
    id: 'doc-must-have-check', 
    categoryId: 'documents', 
    label: 'Make sure you get all papers: Bill, Insurance, Pollution paper, Manual, and Warranty cards',
    description: 'Why: Parts like the battery and tyres have their own warranty cards. You need these to claim free repairs.'
  },

  // Identity & Odometer
  { 
    id: 'id-specs', 
    categoryId: 'identity', 
    label: 'Check that the car has the right features (like screen size, wheels, type of seats) as ordered',
    description: 'Why: Make sure they didn\'t accidentally give you a cheaper version of the car.'
  },
  { 
    id: 'id-odo', 
    categoryId: 'identity', 
    label: 'Check the mileage meter (it should ideally be under 50 km, definitely under 100 km)',
    description: 'Why: If it has been driven a lot, it might have been used as a test-drive car for other people.'
  },
  { 
    id: 'id-wear', 
    categoryId: 'identity', 
    label: 'Look for signs of use inside: dirty seats, worn-out foot pedals, or dirty tires',
    description: 'Why: This helps confirm the car is truly brand new and not a cleaned-up old or returned car.'
  },
  { 
    id: 'id-records', 
    categoryId: 'identity', 
    label: 'Take photos of the car\'s ID plates, engine numbers, and the mileage meter for your records',
    description: 'Why: These photos act as proof of the car\'s condition when you received it, just in case.'
  },

  // Exterior & Paint
  { 
    id: 'ext-light-check', 
    categoryId: 'exterior', 
    label: 'Look at the car outside in natural sunlight (showroom lights can hide scratches)',
    description: 'Why: Bright, angled lights inside the showroom are designed to make the car look perfect and hide minor flaws.'
  },
  { 
    id: 'ext-paint-flaws', 
    categoryId: 'exterior', 
    label: 'Check the whole car for paint scratches, dull spots, or areas where the color doesn\'t match',
    description: 'Why: Uneven paint or color differences mean the car might have been damaged and quickly repainted by the dealer.'
  },
  { 
    id: 'ext-high-risk-areas', 
    categoryId: 'exterior', 
    label: 'Look closely at the corners of bumpers, roof edges, door handles, and mirrors',
    description: 'Why: These spots stick out the most and are easily scratched or dented while being transported on trucks.'
  },
  { 
    id: 'ext-panel-gaps-verify', 
    categoryId: 'exterior', 
    label: 'Make sure the gaps between the doors, hood, and body are even everywhere',
    description: 'Why: Weird or uneven gaps usually mean a part was replaced or the car had a small accident during delivery.'
  },
  { 
    id: 'ext-doors-operation', 
    categoryId: 'exterior', 
    label: 'Open and close all doors, the hood, and the trunk to make sure they move smoothly',
    description: 'Why: Doors that are hard to close might be misaligned, which can cause rattling noises or water leaks later.'
  },
  { 
    id: 'ext-beading-seals', 
    categoryId: 'exterior', 
    label: 'Check that the rubber seals around the doors and windows are soft and firmly in place',
    description: 'Why: Loose or dry rubber seals will let rain water leak into your car and cause loud wind noise on the highway.'
  },

  // Tyres, Wheels & Brakes
  { 
    id: 'tyre-spec-match', 
    categoryId: 'tyres', 
    label: 'Check that all tires are from a good brand and match the size mentioned in the brochure',
    description: 'Why: Sometimes dealers swap good tires for cheaper ones before giving you the car.'
  },
  { 
    id: 'tyre-mfg-date', 
    categoryId: 'tyres', 
    label: 'Check the date printed on the tires to make sure they are new (not more than 6 months old)',
    description: 'Why: Rubber goes bad as it gets old. Old tires can crack easily and are unsafe for driving fast.'
  },
  { 
    id: 'tyre-physical-check', 
    categoryId: 'tyres', 
    label: 'Look closely at all tires for any cuts, bubbles on the side, or nails stuck in them',
    description: 'Why: Damage to the side of a tire cannot be fixed and means you need a completely new tire.'
  },
  { 
    id: 'tyre-rims-rash', 
    categoryId: 'tyres', 
    label: 'Check the metal wheels (alloys) for any scratches, bends, or cracks',
    description: 'Why: Scratched wheels mean the car might have hit a curb while being moved around at the dealership.'
  },
  { 
    id: 'tyre-spare', 
    categoryId: 'tyres', 
    label: 'Make sure the spare tire is present (or the puncture repair kit if your car doesn\'t come with a spare)',
    description: 'Why: Many new cars don\'t have a spare tire. If so, make sure you get the special air pump and repair kit.'
  },
  { 
    id: 'tyre-tools', 
    categoryId: 'tyres', 
    label: 'Check that the jack and tools to change a tire are in the trunk',
    description: 'Why: These basic tools are sometimes missing, leaving you stuck if you get a flat tire on the road.'
  },
  { 
    id: 'tyre-pressure-adjust', 
    categoryId: 'tyres', 
    label: 'Ask the dealer to set the tire air pressure to the normal driving level',
    description: 'Why: Cars are shipped with too much air in the tires to protect them. Driving like this will make the ride very bumpy.'
  },

  // Glass & Lights
  { 
    id: 'glass-cracks', 
    categoryId: 'glass_lights', 
    label: 'Check all windows, windshield, and sunroof very closely for small chips or deep scratches',
    description: 'Why: A tiny chip on the glass can quickly spread into a massive crack when parked in the hot sun.'
  },
  { 
    id: 'lights-fogging', 
    categoryId: 'glass_lights', 
    label: 'Look inside the headlights and taillights for water drops, fog, or broken plastic clips',
    description: 'Why: Water inside the lights means they are not sealed properly and will stop working very soon.'
  },
  { 
    id: 'lights-test', 
    categoryId: 'glass_lights', 
    label: 'Turn on and test all lights: headlights (bright and dim), turn signals, brake lights, and hazard lights',
    description: 'Why: Broken lights are dangerous. If they don\'t turn on, it could be a simple bulb or a bigger wiring problem.'
  },
  { 
    id: 'glass-fittings', 
    categoryId: 'glass_lights', 
    label: 'Gently push on the side mirrors and roof rails to make sure they are attached firmly',
    description: 'Why: Loose parts outside the car can vibrate annoyingly or even fly off while driving on the highway.'
  },

  // Engine & Fluids (ICE-Specific)
  { 
    id: 'eng-clean', 
    categoryId: 'engine', 
    label: 'Pop the hood and check that the engine area is clean and has no oil leaks or excessive mud',
    description: 'Why: A very dirty or muddy engine means the car might have been parked in deep water or driven carelessly.'
  },
  { 
    id: 'eng-fluids-levels', 
    categoryId: 'engine', 
    label: 'Check that all liquid levels are full: engine oil, colorful engine coolant, brake fluid, and wiper water',
    description: 'Why: Low oil or engine coolant can ruin your engine very quickly. Dirty oil means the car might have been driven a lot.'
  },
  { 
    id: 'eng-wiring-check', 
    categoryId: 'engine', 
    label: 'Look for cut wires, loose tape, or signs that a rat might have chewed the cables',
    description: 'Why: Rats love to chew on car wires when cars are parked outside for too long, causing huge electrical problems.'
  },
  {
    id: 'eng-fuel-exhaust-leak',
    categoryId: 'engine',
    label: 'Smell for strong gasoline odors inside or outside the car',
    description: 'Why: A strong smell of petrol or diesel means fuel is leaking, which is extremely dangerous and can cause a fire.'
  },
  { 
    id: 'eng-ignition', 
    categoryId: 'engine', 
    label: 'Start the car—it should start instantly, run smoothly, and make no weird clanking noises',
    description: 'Why: If it struggles to start or shakes a lot, there might be a problem with the engine or bad fuel.'
  },
  { 
    id: 'eng-exhaust-smoke', 
    categoryId: 'engine', 
    label: 'Look at the tailpipe when starting the car. There should be no thick black, blue, or white smoke',
    description: 'Why: Thick colored smoke coming from the back is a major warning sign that the engine has internal damage.'
  },
  { 
    id: 'eng-drips', 
    categoryId: 'engine', 
    label: 'After running the car for a few minutes, look under the engine for any fresh liquid drips on the floor',
    description: 'Why: Fresh drops on the ground mean something is loose and leaking when the engine is running.'
  },

  // Battery & High-Voltage (EV-Specific)
  {
    id: 'ev-battery-health',
    categoryId: 'ev',
    label: 'Ask for the battery health report and ensure there are no warning lights on the dashboard',
    description: 'Why: Electric cars parked for a long time with zero battery can get permanently damaged. A health report proves it is fine.'
  },
  { 
    id: 'ev-port-check', 
    categoryId: 'ev', 
    label: 'Open the charging flap to ensure it moves smoothly and the charging pins inside are clean',
    description: 'Why: Bent or dirty pins will stop your car from charging properly at public fast chargers.'
  },
  { 
    id: 'ev-cables-bag', 
    categoryId: 'ev', 
    label: 'Check that the portable home charging cable is in the trunk, looks new, and comes in its bag',
    description: 'Why: These chargers are very expensive. Sometimes they get lost or swapped at the dealership.'
  },
  {
    id: 'ev-charging-demo',
    categoryId: 'ev',
    label: 'Ask the dealer to plug the car in to show you that it starts charging without any errors',
    description: 'Why: This proves that the car\'s internal charging system actually works before you take it home.'
  },
  {
    id: 'ev-range-verify',
    categoryId: 'ev',
    label: 'Check the remaining range on the screen to see if it makes sense based on the battery percentage',
    description: 'Why: If the battery says 100% but the range is very low, there might be a problem with the battery system.'
  },
  {
    id: 'ev-regen-braking',
    categoryId: 'ev',
    label: 'Test the automatic braking (when you let off the gas pedal) to make sure it slows the car down smoothly',
    description: 'Why: This feature helps charge your battery while driving. It should feel smooth and not jerky.'
  },
  {
    id: 'ev-thermal-mgmt',
    categoryId: 'ev',
    label: 'Turn on the AC to the coldest setting and see if the driving range on the screen drops drastically',
    description: 'Why: A huge drop in range just by turning on the AC might mean the battery cooling system is not working efficiently.'
  },
  {
    id: 'ev-warranty-docs',
    categoryId: 'ev',
    label: 'Make sure you get the special 8-year warranty paper for the main battery',
    description: 'Why: The battery is the most expensive part of the car. You absolutely need the physical warranty card for it.'
  },

  // Interior & Cabin
  { 
    id: 'int-general', 
    categoryId: 'interior', 
    label: 'Check all seats, the roof inside, and the dashboard for stains, rips, or scratches',
    description: 'Why: Dirty tools or careless cleaning can easily stain light-colored seats or tear the fabric inside.'
  },
  { 
    id: 'int-water-leak', 
    categoryId: 'interior', 
    label: 'Lift the floor mats and touch the carpet underneath to make sure it is completely dry',
    description: 'Why: Wet carpets mean water leaked into the car, which causes bad smells and dangerous electrical problems.'
  },
  { 
    id: 'int-seats-move', 
    categoryId: 'interior', 
    label: 'Move all seats forward, backward, up, and down to make sure the controls work smoothly',
    description: 'Why: Seats that are hard to move might have broken tracks or stuck motors that need fixing.'
  },
  { 
    id: 'int-belts', 
    categoryId: 'interior', 
    label: 'Pull all the seat belts, click them in, and give them a quick tug to make sure they lock properly',
    description: 'Why: Seatbelts save lives. If one doesn\'t pull out smoothly or lock when pulled hard, the car is not safe.'
  },
  { 
    id: 'int-glovebox', 
    categoryId: 'interior', 
    label: 'Open and close the glovebox and center armrest to make sure they latch securely',
    description: 'Why: Broken latches will make the glovebox stay open or rattle noisily while you drive.'
  },
  { 
    id: 'int-cabin-smell', 
    categoryId: 'interior', 
    label: 'Turn on the AC and smell the air for any bad, moldy, or stale odors',
    description: 'Why: A bad smell usually means mold is growing inside the AC system and needs to be cleaned.'
  },

  // Electronics & AC
  { 
    id: 'elec-instrument', 
    categoryId: 'electronics', 
    label: 'Start the car and make sure all the warning lights on the driver\'s screen turn off',
    description: 'Why: If lights like "Check Engine" or "Airbag" stay on after starting, there is a major problem with the car.'
  },
  { 
    id: 'elec-climate', 
    categoryId: 'electronics', 
    label: 'Turn the AC up all the way—it should blow very cold air quickly from all the correct vents',
    description: 'Why: A weak AC or strange clicking noises mean the system is faulty or low on cooling gas.'
  },
  { 
    id: 'elec-infotainment-test', 
    categoryId: 'electronics', 
    label: 'Play with the main touch screen, connect your phone, and make sure it doesn\'t freeze or lag',
    description: 'Why: The screen is a very expensive computer. If it\'s slow or freezes now, it will only get worse.'
  },
  { 
    id: 'elec-speakers-test', 
    categoryId: 'electronics', 
    label: 'Play some music and check that sound is coming clearly from all the speakers',
    description: 'Why: Sometimes speakers are blown out or disconnected from the factory by mistake.'
  },
  { 
    id: 'elec-controls-switches', 
    categoryId: 'electronics', 
    label: 'Test every button you can find: windows, door locks, mirror adjusters, and inside lights',
    description: 'Why: Buttons or window motors can be faulty. It\'s better to find out before you take the car home.'
  },
  { 
    id: 'elec-wipers-washer', 
    categoryId: 'electronics', 
    label: 'Test the windshield wipers and spray the washer fluid to make sure they wipe the glass clean',
    description: 'Why: Old, hard wiper blades will scratch your brand new glass. Blocked sprayers are dangerous when driving in mud.'
  },
  { 
    id: 'elec-obd-scanner', 
    categoryId: 'electronics', 
    label: '(Optional) Have a mechanic plug in a scanner to check for hidden computer errors',
    description: 'Why: Sometimes dealers hide warning lights by turning them off temporarily. A scanner reads the deep computer memory.'
  },

  // Road Test & Drive
  { 
    id: 'road-response', 
    categoryId: 'road_test', 
    label: 'While driving, press the gas pedal—the car should speed up smoothly without jerking',
    description: 'Why: If the car stutters or struggles to speed up, there could be a problem with the engine or gearbox.'
  },
  { 
    id: 'road-steering-pull', 
    categoryId: 'road_test', 
    label: 'On a straight, flat road, let go of the steering wheel slightly to see if the car pulls to one side',
    description: 'Why: If the car drifts to the left or right, the wheel alignment is bad or the suspension was damaged.'
  },
  { 
    id: 'road-steering-noise', 
    categoryId: 'road_test', 
    label: 'Turn the steering wheel all the way to the left and right while moving slowly to listen for noises',
    description: 'Why: Grinding or clicking noises when turning mean the steering system has a major defect.'
  },
  { 
    id: 'road-brake-feel', 
    categoryId: 'road_test', 
    label: 'Press the brakes—they should feel tight, and the car should stop straight without vibrating',
    description: 'Why: If the brake pedal shakes or pulses, the brake discs are damaged and need to be replaced.'
  },
  { 
    id: 'road-suspension', 
    categoryId: 'road_test', 
    label: 'Drive over a speed bump or rough road and listen for loud squeaks, rattles, or clunks',
    description: 'Why: Loud metal noises over bumps usually mean the suspension parts are loose or broken.'
  },
  { 
    id: 'road-transmission', 
    categoryId: 'road_test', 
    label: 'Check that changing gears (manual or automatic) feels smooth and easy, without heavy jerks',
    description: 'Why: Hard or jerky gear changes point to a serious problem with the transmission system.'
  },

  // Accessories & Keys
  { 
    id: 'acc-verify', 
    categoryId: 'accessories', 
    label: 'Check that all extra items you paid for (floor mats, seat covers, dashcam) are actually inside the car',
    description: 'Why: Dealers often forget to install extra accessories in the rush of delivering the car.'
  },
  { 
    id: 'acc-quality-oem', 
    categoryId: 'accessories', 
    label: 'Make sure the accessories are the original brand you agreed on, not cheap copies',
    description: 'Why: Dealers sometimes secretly install cheaper, low-quality parts to save themselves money.'
  },
  { 
    id: 'acc-safety-kit', 
    categoryId: 'accessories', 
    label: 'Make sure the emergency first-aid kit and the red warning triangle are in the trunk',
    description: 'Why: This is basic safety gear you must have by law in case you break down on the road.'
  },
  { 
    id: 'acc-all-keys', 
    categoryId: 'accessories', 
    label: 'Make sure you receive two sets of keys, and test that both of them can lock and start the car',
    description: 'Why: Smart keys are very expensive to replace. Make sure both keys actually work with your car.'
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

