import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEventParticipant } from 'utils/types/zetkin';
import { ParticipantOpKind, ParticipantWithPoolState } from '../types';
import { participantsLoad, participantsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type UseEventParticipantsWithChangesReturn = {
  bookedParticipants: ParticipantWithPoolState[];
  pendingParticipants: ParticipantWithPoolState[];
};

export default function useEventParticipantsWithChanges(
  orgId: number,
  eventId: number
): UseEventParticipantsWithChangesReturn {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.events.participantsByEventId[eventId]
  );
  const pendingOps = useAppSelector(
    (state) => state.events.pendingParticipantOps
  );
  const participantsByEventId = useAppSelector(
    (state) => state.events.participantsByEventId
  );
  const dispatch = useAppDispatch();

  const participantsFuture = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => participantsLoad(eventId),
    actionOnSuccess: (participants) =>
      participantsLoaded([eventId, participants]),
    loader: () =>
      apiClient.get<ZetkinEventParticipant[]>(
        `/api/orgs/${orgId}/actions/${eventId}/participants`
      ),
  });

  const bookedParticipants: ParticipantWithPoolState[] = [];
  const pendingParticipants: ParticipantWithPoolState[] = [];
  const addedIds: number[] = [];

  if (participantsFuture.data) {
    const allParticipants: ZetkinEventParticipant[] = [];
    Object.values(participantsByEventId).forEach((list) => {
      list.items.forEach((item) => {
        if (item.data) {
          allParticipants.push(item.data);
        }
      });
    });

    participantsFuture.data.forEach((person) => {
      const movedAway = pendingOps.some(
        (op) =>
          op.eventId == eventId &&
          op.personId == person.id &&
          op.kind == ParticipantOpKind.REMOVE
      );

      bookedParticipants.push({
        person,
        status: movedAway ? 'removed' : 'booked',
      });
    });

    pendingOps
      .concat()
      .sort((a, b) => {
        if (a.kind == ParticipantOpKind.ADD) {
          return -1;
        } else if (b.kind == ParticipantOpKind.ADD) {
          return 1;
        } else {
          return 0;
        }
      })
      .forEach((op) => {
        const participant = allParticipants.find((p) => p.id == op.personId);

        if (participant) {
          const addingToThisEvent =
            op.kind == ParticipantOpKind.ADD && op.eventId == eventId;
          const addedPreviously = addedIds.includes(op.personId);
          const removingFromAnotherEvent =
            op.kind == ParticipantOpKind.REMOVE && op.eventId != eventId;

          if (addingToThisEvent) {
            addedIds.push(op.personId);
            bookedParticipants.push({
              person: participant,
              status: 'added',
            });
          } else if (removingFromAnotherEvent && !addedPreviously) {
            pendingParticipants.push({
              person: participant,
              status: 'pending',
            });
          }
        }
      });
  }

  return {
    bookedParticipants,
    pendingParticipants,
  };
}
