import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getCustomFields from 'features/smartSearch/fetching/getCustomFields';
import { getTimeFrameWithConfig } from '../../utils';
import {
  OPERATION,
  PersonFieldFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.personField;

interface DisplayPersonFieldProps {
  filter: SmartSearchFilterWithId<PersonFieldFilterConfig>;
}

const DisplayPersonField = ({
  filter,
}: DisplayPersonFieldProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const fieldsQuery = useQuery(
    ['customFields', orgId],
    getCustomFields(orgId as string)
  );
  const fields = fieldsQuery.data || [];
  const { config } = filter;
  const { field: slug, search } = config;
  const op = filter.op || OPERATION.ADD;
  const { timeFrame, after, before, numDays } = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const getField = (slug?: string) => fields.find((f) => f.slug === slug);
  const field = getField(slug);

  const fieldType = field?.type || '';
  if (fieldType != 'date' && fieldType != 'text' && fieldType != 'url') {
    // TODO:
    return <></>;
  }

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        field:
          fieldType == 'date' ? (
            <Msg
              id={localMessageIds.preview.date}
              values={{
                fieldName: field?.title ?? '',
                timeFrame: (
                  <Msg
                    id={messageIds.timeFrame.preview[timeFrame]}
                    values={{
                      afterDate: after?.toISOString().slice(0, 10),
                      beforeDate: before?.toISOString().slice(0, 10),
                      days: numDays,
                    }}
                  />
                ),
              }}
            />
          ) : (
            <Msg
              id={localMessageIds.preview[fieldType]}
              values={{
                fieldName: field?.title ?? '',
                searchTerm: search || '',
              }}
            />
          ),
      }}
    />
  );
};

export default DisplayPersonField;
