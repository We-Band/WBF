import { NOSCHEDULE } from '@constants/time';
import * as S from './Calendar.styled';
import CalendarDateList from './CalendarDateList';
import CalendarTimeList from './CalendarTimeList';
import { sumBinaryStrings } from '@utils/schedule';
import CalendarScheduleList from './CalendarScheduleList';
import { useLiteContext } from '@components/lite/LiteHome';
import { useEffect, useState } from 'react';
import useTeamStore from '@store/team';
import { Member } from '@api/team';

const NO_MEMBERS: Member[] = [];

const LiteCalendar = ({ userToggle }: { userToggle: boolean }) => {
  const members = useTeamStore((state) => state.team?.members ?? NO_MEMBERS);
  const totalUser = members.length;
  const scheduleString = sumBinaryStrings(members.map((m) => m.schedule));
  const { selectedUser, setEditingSchedule } = useLiteContext();
  const [selectedUserSchedule, setSelectedUserSchedule] = useState('');

  useEffect(() => {
    if (selectedUser === '') {
      setSelectedUserSchedule(NOSCHEDULE);
      return;
    }

    const targetSchedule =
      members.find((member) => member.name === selectedUser)?.schedule ??
      NOSCHEDULE;
    setSelectedUserSchedule(targetSchedule);
    setEditingSchedule(targetSchedule);
  }, [selectedUser, members]);

  return (
    <S.LiteCalendarContainer>
      <CalendarDateList />
      <S.CalendarScheduleContainer>
        <CalendarTimeList />
        {selectedUser === '' ? (
          !userToggle ? (
            <>
              <CalendarScheduleList
                totalUser={totalUser}
                scheduleString={scheduleString}
                edit={false}
              />
            </>
          ) : (
            <>
              <CalendarScheduleList
                totalUser={1}
                scheduleString={NOSCHEDULE}
                edit={userToggle}
              />
            </>
          )
        ) : (
          <>
            <CalendarScheduleList
              key={selectedUserSchedule}
              totalUser={1}
              scheduleString={selectedUserSchedule}
              edit={userToggle}
            />
          </>
        )}
      </S.CalendarScheduleContainer>
    </S.LiteCalendarContainer>
  );
};

export default LiteCalendar;
