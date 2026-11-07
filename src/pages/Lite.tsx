import LiteHome from '@components/lite/LiteHome';
import OnBoardingLite from '@components/lite/onBoarding/OnBoardingLite';
import { useParams } from 'react-router-dom';

const Lite = () => {
  const { teamId } = useParams();

  return teamId ? (
    <LiteHome key={teamId} teamId={teamId} />
  ) : (
    <OnBoardingLite />
  );
};

export default Lite;
