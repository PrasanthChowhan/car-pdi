import { AlertOctagon, ShieldAlert, XCircle, Hand, EyeOff, Lock, FileQuestion, Users } from 'lucide-react';

export default function DealBreakersPanel() {
  const dealBreakers = [
    {
      icon: Hand,
      title: "Refusing the PDI",
      description: "If the dealer refuses to let you perform a PDI, denies access to the stockyard, or claims \"company policy\" forbids it, walk away. They are hiding something (transit damage, demo car, old stock). You are fully entitled to inspect before registration."
    },
    {
      icon: XCircle,
      title: "Demanding Full Payment Before PDI",
      description: "Never pay the full amount before you have personally inspected the car and are satisfied. Only the booking amount should be paid beforehand. Dealers create artificial urgency (\"pay now to unlock the car/start registration\"); do not fall for it."
    },
    {
      icon: EyeOff,
      title: "Forcing Evening/Dark Inspections",
      description: "The dealer insists you do the PDI in the evening, at night, or in a dimly lit basement/showroom. This is a classic tactic to hide paint defects, repaints, and panel misalignments. Insist on daytime, open natural light."
    },
    {
      icon: Lock,
      title: "\"Locked\" Features or Restricted Access",
      description: "The dealer claims the infotainment system is \"locked,\" or you cannot test the sunroof, or they block you from using an OBD scanner. They may be hiding underlying error codes or faulty electronics."
    },
    {
      icon: FileQuestion,
      title: "Evasive About the VIN",
      description: "The dealer hesitates or refuses to share the Vehicle Identification Number (VIN) or engine number before you arrive. They may be trying to slip you a much older manufactured car."
    },
    {
      icon: Users,
      title: "Refusing Third-Party Mechanics",
      description: "If you want to bring a trusted mechanic for a second opinion and the dealer prohibits it, it's a huge warning sign."
    }
  ];

  return (
    <div className="checklist-container animate-fadeIn">
      <div 
        className="card" 
        style={{ 
          padding: '24px', 
          backgroundColor: 'rgba(207, 45, 86, 0.05)', 
          border: '1px solid var(--color-semantic-error)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid rgba(207, 45, 86, 0.15)', paddingBottom: '16px' }}>
          <div style={{ 
            backgroundColor: 'var(--color-semantic-error)', 
            padding: '12px', 
            borderRadius: 'var(--rounded-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="display-xs" style={{ color: 'var(--color-semantic-error)', marginBottom: '8px' }}>
              Absolute Deal-Breakers
            </h2>
            <p className="body-md" style={{ color: 'var(--color-ink)', margin: 0 }}>
              <strong>Before you even start the physical inspection, watch out for these massive red flags from the dealership.</strong> If you experience these, strongly consider walking away. NEVER buy a car from a dealer exhibiting these behaviors.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {dealBreakers.map((db, idx) => (
            <div 
              key={idx}
              style={{ 
                display: 'flex', 
                gap: '16px', 
                padding: '16px', 
                backgroundColor: 'var(--color-canvas)', 
                borderRadius: 'var(--rounded-md)',
                border: '1px solid var(--color-hairline-strong)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ color: 'var(--color-semantic-error)', flexShrink: 0, marginTop: '2px' }}>
                <db.icon size={24} />
              </div>
              <div>
                <h3 className="body-md" style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px' }}>
                  {db.title}
                </h3>
                <p className="body-sm" style={{ color: 'var(--color-body)', margin: 0, lineHeight: 1.5 }}>
                  {db.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          marginTop: '8px', 
          padding: '16px', 
          backgroundColor: 'rgba(207, 45, 86, 0.1)', 
          borderRadius: 'var(--rounded-md)', 
          borderLeft: '4px solid var(--color-semantic-error)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertOctagon size={24} style={{ color: 'var(--color-semantic-error)' }} />
          <p className="body-sm" style={{ color: 'var(--color-ink)', margin: 0, fontWeight: 500 }}>
            Creating high-pressure situations to force a quick sign-off and blind payment is a common tactic. Take your time. Your peace of mind is worth more than a small discount or a rushed delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
