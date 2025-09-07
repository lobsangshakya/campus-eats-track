interface TrafficLightProps {
  studentCount: number;
  thresholds?: {
    green: number;
    yellow: number;
  };
}

const TrafficLight = ({ studentCount, thresholds = { green: 50, yellow: 80 } }: TrafficLightProps) => {
  const getStatus = () => {
    if (studentCount < thresholds.green) return 'green';
    if (studentCount < thresholds.yellow) return 'yellow';
    return 'red';
  };

  const status = getStatus();
  
  const statusConfig = {
    green: {
      color: 'bg-status-green',
      label: 'Low Crowd',
      description: 'Great time to visit!'
    },
    yellow: {
      color: 'bg-status-yellow',
      label: 'Moderate Crowd',
      description: 'Some waiting expected'
    },
    red: {
      color: 'bg-status-red',
      label: 'High Crowd',
      description: 'Consider waiting'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:shadow-md transition-all duration-300">
      <div className="relative">
        <div className={`w-8 h-8 rounded-full ${currentStatus.color} shadow-lg transition-all duration-500 ease-out`} />
        <div className={`absolute inset-0 w-8 h-8 rounded-full ${currentStatus.color} opacity-30 animate-ping`} />
      </div>
      
      <div className="animate-in slide-in-from-left-2 duration-500">
        <h3 className="font-semibold text-card-foreground transition-colors duration-300">
          {currentStatus.label}
        </h3>
        <p className="text-sm text-muted-foreground">
          {currentStatus.description}
        </p>
      </div>
    </div>
  );
};

export default TrafficLight;