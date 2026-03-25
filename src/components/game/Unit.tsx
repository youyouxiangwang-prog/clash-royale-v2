import type { Unit as UnitType } from '../../types';

interface UnitProps {
  unit: UnitType;
}

const Unit: React.FC<UnitProps> = ({ unit }) => {
  const healthPercent = (unit.health / unit.maxHealth) * 100;

  return (
    <div 
      className={`unit ${unit.isEnemy ? 'enemy' : 'ally'}`}
      style={{
        left: unit.position.x,
        top: unit.position.y,
      }}
    >
      <div className="unit-body" />
      <div className="unit-health">
        <div 
          className="unit-health-fill" 
          style={{ width: `${healthPercent}%` }}
        />
      </div>
    </div>
  );
};

export default Unit;