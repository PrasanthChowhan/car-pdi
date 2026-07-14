export interface ChecklistItemTemplate {
  id: string;
  categoryId: string;
  label: string;
  description?: string; // Optional beginner-friendly hint or explanation
  extendedDescription?: string; // Detailed breakdown for complex items
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
  {
    id: 'tutorial-practice',
    categoryId: 'identity',
    label: '👉 Practice: Try tapping the red warning triangle to Flag this item, then write a quick note!',
    description: 'Why: Logging notes and photos on defects helps compile them into your final PDF report.',
    extendedDescription: 'Try clicking the warning triangle icon on the right side of this card to flag it as a defect. Once flagged, a note input will open below where you can type or select suggestions.'
  },
  { 
    id: 'doc-invoice-price', 
    categoryId: 'documents', 
    label: 'Check if the base car price on your bill matches the official website price',
    description: 'Why: Sometimes dealers quietly add extra money to the starting price, making you pay more.',
    extendedDescription: 'Dealers sometimes inflate the "Ex-Showroom" price on the quotation sheet. Always open the manufacturer\'s official website on your phone and compare the exact variant price. If they don\'t match, the dealer is trying to pocket the difference.'
  },
  { 
    id: 'doc-rto-fees', 
    categoryId: 'documents', 
    label: 'Check if road tax and registration fees match official government rates',
    description: 'Why: Dealers sometimes overcharge for taxes. Always ask for the official government receipt.',
    extendedDescription: 'Road Tax (RTO) is a strict percentage set by the government. Dealers often overcharge by ₹3,000 to ₹10,000 and label it "RTO Processing". You have the right to ask for the official RTO receipt and demand a refund for any excess amount charged.'
  },
  { 
    id: 'doc-insurance', 
    categoryId: 'documents', 
    label: 'Check insurance details (car value is correct, full bumper-to-bumper cover included)',
    description: 'Why: Making sure your car is fully covered at its actual value saves you money if there is an accident.',
    extendedDescription: 'Insurance terms are tricky: "IDV" is your car\'s declared value—if the car is totaled, this is what you get paid. Dealers often lower IDV to make the premium look cheap. "Zero-Depreciation" means bumper-to-bumper cover (you pay almost nothing for plastic parts if they break). "RTI" (Return to Invoice) pays you the full original on-road price if the car is stolen or totaled. Ensure these are checked!'
  },
  { 
    id: 'doc-extra-charges', 
    categoryId: 'documents', 
    label: 'Look for "handling" or "logistics" charges on the bill and ask to remove them',
    description: 'Why: These extra fees are not legally allowed. Dealers sometimes add them just for extra profit.',
    extendedDescription: 'The "ex-showroom" price already includes factory-to-dealer transport and dealer profit. Dealers may illegally add ₹5,000 to ₹25,000 disguised as "Logistics", "Incidental", "Stockyard", "Depot Charges", "Documentation Fees", "Miscellaneous Post-Sale", or "RTO Smoothing" fees. They may also try to force you to buy an "Essential Accessory Kit" which is 100% optional. If you see these, ask for a written justification on their letterhead. Usually, they will remove it immediately to avoid complaints to the manufacturer or RTO.'
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
    description: 'Why: This proves the engine in your car is the one the government has on record for you.',
    extendedDescription: 'The engine number is usually stamped on the metal engine block itself. You might need to shine a flashlight to see it, or ask the dealer to point it out. It MUST match the number on your Form 22 and insurance document exactly.'
  },
  { 
    id: 'doc-stock-age', 
    categoryId: 'documents', 
    label: 'Check the car\'s build date to make sure it hasn\'t been sitting at the dealer for too long',
    description: 'Why: Cars sitting outdoors for months can develop paint issues, rust, or weak batteries.',
    extendedDescription: 'Every car has a 17-character VIN (serial number) visible on the bottom corner of the windshield or the driver\'s door frame. You can type this VIN into our app\'s VIN Decoder, and it will tell you exactly what month and year the car was built. If it is more than 3-4 months old, thoroughly check the battery and paint!'
  },
  { 
    id: 'doc-must-have-check', 
    categoryId: 'documents', 
    label: 'Make sure you get all papers: Bill, Insurance, Pollution paper, Manual, and Warranty cards',
    description: 'Why: Parts like the battery and tyres have their own warranty cards. You need these to claim free repairs.'
  },
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
    description: 'Why: If it has been driven a lot, it might have been used as a test-drive car for other people.',
    extendedDescription: 'It is normal for a brand new car to have 10-50 kilometers on the meter. This comes from testing at the factory and driving it onto transport trucks. However, anything over 100 km is a red flag—it means the dealer might have used it as a test-drive vehicle or driven it from a far away stockyard.'
  },
  { 
    id: 'id-wear', 
    categoryId: 'identity', 
    label: 'Look for signs of use inside: dirty seats, worn-out foot pedals, or dirty tires',
    description: 'Why: This helps confirm the car is truly brand new and not a cleaned-up old or returned car.',
    extendedDescription: 'Look closely at the rubber foot pedals (accelerator and brake). On a truly new car, the rubber should look fresh and matte. If it looks shiny, worn down, or has dirt packed into the grooves, the car has been driven a lot.'
  },
  { 
    id: 'id-records', 
    categoryId: 'identity', 
    label: 'Take photos of the car\'s ID plates, engine numbers, and the mileage meter for your records',
    description: 'Why: These photos act as proof of the car\'s condition when you received it, just in case.'
  },
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
    description: 'Why: Uneven paint or color differences mean the car might have been damaged and quickly repainted by the dealer.',
    extendedDescription: 'How to check: Look at the car from an angle, not straight on. If a panel was repainted by the dealer, it might look slightly duller or have an "orange peel" bumpy texture compared to the smooth factory paint. Also check the black rubber window seals for accidental paint overspray.'
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
    description: 'Why: Weird or uneven gaps usually mean a part was replaced or the car had a small accident during delivery.',
    extendedDescription: 'Try this trick: Slide your finger along the gap between the front door and the car body on the left side. Then do the exact same thing on the right side. The gap should feel exactly the same size. If one side is much wider, the door was removed or the car was in a crash.'
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
    description: 'Why: Rubber goes bad as it gets old. Old tires can crack easily and are unsafe for driving fast.',
    extendedDescription: 'Every tyre has a 4-digit code printed in a small oval on its side. For example, "3223" means the tyre was made in the 32nd week of 2023. If the date is more than a year old, tell the dealer you want fresh tyres. Rubber degrades even when just sitting in the sun.'
  },
  { 
    id: 'tyre-physical-check', 
    categoryId: 'tyres', 
    label: 'Look closely at all tires for any cuts, bubbles on the side, or nails stuck in them',
    description: 'Why: Damage to the side of a tire cannot be fixed and means you need a completely new tire.',
    extendedDescription: 'If a car hit a deep pothole while being transported, the tyre sidewall might have a "bubble" (it looks like a small balloon popping out). This means the internal structure is broken and the tyre could explode at high speeds. It must be replaced immediately.'
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
    description: 'Why: Cars are shipped with too much air in the tires to protect them. Driving like this will make the ride very bumpy.',
    extendedDescription: 'To prevent tires from going flat during months of shipping, factories pump them up to 45-50 PSI. Dealers often forget to lower this back to the normal 32-35 PSI during delivery. Driving with over-inflated tires is bouncy, uncomfortable, and dangerous for braking.'
  },
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
    description: 'Why: Water inside the lights means they are not sealed properly and will stop working very soon.',
    extendedDescription: 'A tiny bit of mist in the corners of a headlight on a rainy day might be normal. However, if you see actual water droplets dripping down or a puddle forming inside the clear plastic, the factory seal is broken and the entire light unit needs to be replaced under warranty.'
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
    description: 'Why: Low oil or engine coolant can ruin your engine very quickly. Dirty oil means the car might have been driven a lot.',
    extendedDescription: 'How to check: The engine oil is checked using the yellow or orange ring-pull dipstick. Coolant is the brightly colored (pink or green) liquid inside a clear plastic tank—it should be between the MIN and MAX lines. If anything is completely empty, refuse the car.'
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
    description: 'Why: Thick colored smoke coming from the back is a major warning sign that the engine has internal damage.',
    extendedDescription: 'Different smoke colors mean different problems: Black smoke means the engine is burning too much fuel. Blue smoke means the engine is burning its own oil (a very bad sign for a new car). Thick white smoke (like clouds) means engine coolant is leaking into the engine. Water droplets are normal, colored smoke is not!'
  },
  { 
    id: 'eng-drips', 
    categoryId: 'engine', 
    label: 'After running the car for a few minutes, look under the engine for any fresh liquid drips on the floor',
    description: 'Why: Fresh drops on the ground mean something is loose and leaking when the engine is running.',
    extendedDescription: 'Important note: If you see clear water dripping from the middle of the car, don\'t panic! That is just harmless water condensation from the AC. But if you see dark oil, green/pink coolant, or smell fuel dripping, that is a major defect.'
  },
  {
    id: 'ev-battery-health',
    categoryId: 'ev',
    label: 'Ask for the battery health report and ensure there are no warning lights on the dashboard',
    description: 'Why: Electric cars parked for a long time with zero battery can get permanently damaged. A health report proves it is fine.',
    extendedDescription: 'Ask the dealer for the SoH (State of Health) diagnostic printout. It should ideally be 100%. If an EV sits in a stockyard for months with a 0% charge, the battery cells take permanent damage. This report is your proof that you are receiving a brand-new, healthy battery.'
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
    description: 'Why: This feature helps charge your battery while driving. It should feel smooth and not jerky.',
    extendedDescription: 'In an EV, taking your foot off the accelerator should make the car feel like it is braking. This is called Regenerative Braking—the electric motor runs backwards to charge the battery. If the car coasts freely without slowing down at all (and the setting is turned on), the system is faulty.'
  },
  {
    id: 'ev-thermal-mgmt',
    categoryId: 'ev',
    label: 'Turn on the AC to the coldest setting and see if the driving range on the screen drops drastically',
    description: 'Why: A huge drop in range just by turning on the AC might mean the battery cooling system is not working efficiently.',
    extendedDescription: 'In an EV, the AC runs off the main battery. It is normal for the range to drop slightly (like 10-20km) when you turn on the AC. However, if turning on the AC causes the range meter to suddenly plummet by 20% or more, there might be a fault in the battery\'s thermal management system.'
  },
  {
    id: 'ev-warranty-docs',
    categoryId: 'ev',
    label: 'Make sure you get the special 8-year warranty paper for the main battery',
    description: 'Why: The battery is the most expensive part of the car. You absolutely need the physical warranty card for it.'
  },
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
    description: 'Why: Wet carpets mean water leaked into the car, which causes bad smells and dangerous electrical problems.',
    extendedDescription: 'If the carpets are wet, it usually means the AC drain tube is clogged from the factory, or the rubber seals around the windshield weren\'t glued properly. Water inside a car will eventually cause severe electrical shorts.'
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
    description: 'Why: Sometimes dealers hide warning lights by turning them off temporarily. A scanner reads the deep computer memory.',
    extendedDescription: 'An OBD (On-Board Diagnostics) scanner is a small device mechanics plug in under the steering wheel to read the car\'s computer. It can reveal hidden error codes that the dealer might have temporarily erased from the dashboard screen.'
  },
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
    description: 'Why: If the brake pedal shakes or pulses, the brake discs are damaged and need to be replaced.',
    extendedDescription: 'If you feel the brake pedal vibrating or "pulsing" up and down when you brake gently, the metal brake discs are warped. (Note: If you brake very hard on a slippery surface, a vibration is just the ABS safety system working normally, but it shouldn\'t happen on a dry road during a normal stop).'
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
    description: 'Why: Smart keys are very expensive to replace. Make sure both keys actually work with your car.',
    extendedDescription: 'A single modern smart key (key fob) costs between ₹5,000 and ₹15,000 to replace. If the dealer tells you "we will give you the second key later," do not sign the delivery papers until they put that promise in writing!'
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

