import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.calendar', {
  createMenu: {
    shiftEvent: m('Create multiple events that form shifts'),
    singleEvent: m('Create single event'),
  },
  event: {
    differentLocations: m<{ numLocations: number }>(
      '{numLocations} different locations'
    ),
    events: m('Events'),
    noContactSelected: m('No contact selected'),
    remindersNotSent: m<{ numNotSent: number }>(
      '{numNotSent} Reminders not sent'
    ),
    unbookedSignups: m<{ numUnbooked: number }>(
      '{numUnbooked} Unbooked signups'
    ),
    underbooked: m<{ numUnderbooked: number }>(
      '{numUnderbooked} Underbooked events'
    ),
    withSignups: m<{ numWithSignups: number }>('{numWithSignups} With signups'),
    withoutContact: m<{ numWithoutContact: number }>(
      '{numWithoutContact} Without contact'
    ),
  },
  eventFilter: {
    collapse: m('Collapse'),
    expand: m<{ numOfOptions: number }>(
      '{numOfOptions, plural, one {+ 1 more event type} other {+ # more event types}}'
    ),
    filter: m('Filter'),
    filterOptions: {
      actionFilters: {
        missing: m('Contact person missing'),
        overbooked: m('Overbooked'),
        pending: m('Signups pending'),
        title: m('Filter on action needed'),
        underbooked: m('Underbooked'),
        unsent: m('Unsent notifications'),
      },
      eventTypes: {
        title: m('Filter on event types'),
      },
      stateFilters: {
        cancelled: m('Cancelled'),
        draft: m('Draft'),
        published: m('Published'),
        scheduled: m('Scheduled'),
        title: m('Filter on publish state'),
      },
    },
    reset: m('Reset Filters'),
    toggle: {
      all: m('All'),
      none: m('None'),
    },
    type: m('Type to filter content'),
  },
  lastDayWithEvents: m<{ numEvents: number }>(
    'There {numEvents, plural, one {was one event} other {were {numEvents} events}} on the last active day'
  ),
  loadMore: m('Load more'),
  moreEvents: m<{ numEvents: number }>(
    '{numEvents, plural, one {# more event} other {# more events}}'
  ),
  next: m('NEXT'),
  prev: m('PREV'),
  rangeLabel: m('Pick an option'),
  ranges: {
    day: m('Day'),
    month: m('Month'),
    week: m('Week'),
  },
  showMore: m('Show'),
  today: m('Today'),
});
