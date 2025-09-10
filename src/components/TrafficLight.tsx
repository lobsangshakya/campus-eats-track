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
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-300">
      <div className="relative">
        <div className={`w-10 h-10 rounded-full ${currentStatus.color} shadow-lg transition-all duration-500 ease-out flex items-center justify-center`}>
          <div className="w-6 h-6 rounded-full bg-white/20"></div>
        </div>
        <div className={`absolute inset-0 w-10 h-10 rounded-full ${currentStatus.color} opacity-30 animate-ping`} />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg transition-colors duration-300">
          {currentStatus.label}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {currentStatus.description}
        </p>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          {studentCount} students currently
        </div>
      </div>
    </div>
  );
};

export default TrafficLight;
