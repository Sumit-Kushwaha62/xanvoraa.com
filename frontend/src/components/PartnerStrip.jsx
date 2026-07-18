import SiteIcon from './SiteIcon'
const PartnerStrip = () => {
  const partners = [
    { name: 'TechFlow', icon: 'speed' },
    { name: 'CloudScale', icon: 'cloud' },
    { name: 'NexusAI', icon: 'network' },
    { name: 'DataCore', icon: 'server' },
    { name: 'WaveMedia', icon: 'waves' },
    { name: 'Zenith', icon: 'mountain' },
  ];

  // Double the array for seamless infinite scroll
  const displayPartners = [...partners, ...partners];

  return (
    <div className="partner-strip">
      <div className="container">
        <p className="partner-strip__label">Trusted by industry leaders</p>
        <div className="partner-strip__track-wrapper">
          <div className="partner-strip__track">
            {displayPartners.map((partner, index) => (
              <div key={index} className="partner-strip__item">
                <span className="partner-strip__icon"><SiteIcon name={partner.icon} size={20} /></span>
                <span className="partner-strip__name">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerStrip;
