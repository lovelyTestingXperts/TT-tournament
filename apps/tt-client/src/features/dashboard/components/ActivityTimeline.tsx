const activities = [
  {
    id: 1,
    text: 'Tournament created',
    time: '2 mins ago',
  },
  {
    id: 2,
    text: 'Player joined',
    time: '15 mins ago',
  },
  {
    id: 3,
    text: 'Match scheduled',
    time: '1 hour ago',
  },
  {
    id: 4,
    text: 'Tournament completed',
    time: 'Yesterday',
  },
];

export default function ActivityTimeline() {
  return (
    <div className="glass-card rounded-[32px] p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map(
          (activity) => (
            <div
              key={activity.id}
              className="flex gap-4"
            >
              <div
                className="
                mt-2
                h-3
                w-3
                rounded-full
                bg-violet-400
              "
              />

              <div>
                <p className="font-medium">
                  {
                    activity.text
                  }
                </p>

                <span
                  className="
                  text-sm
                  text-white/50
                "
                >
                  {
                    activity.time
                  }
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}