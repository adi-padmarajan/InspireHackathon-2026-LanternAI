import { useColorSettingsStore } from '../../store/colorSettingsStore';

export const UserGreeting: React.FC = () => {
  const { username } = useColorSettingsStore();
  const {
    usernameColor,
    highlightColor,
    logoBgColor,
    logoFlowerColor,
  } = useColorSettingsStore();

  return (
    <div style={{ backgroundColor: logoBgColor }} className="flex items-center">
      <Lamp style={{ color: logoFlowerColor }} className="text-4xl" />
      <span style={{ color: usernameColor }} className="font-semibold">
        {username}
      </span>
    </div>
  );
};