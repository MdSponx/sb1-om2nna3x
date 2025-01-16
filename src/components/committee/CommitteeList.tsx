import React from 'react';
import { Container } from '../ui/Container';
import { PositionGroup } from './PositionGroup';
import { CommitteeMember, PositionGroup as PositionGroupType } from '../../types/committee';
import { useLanguage } from '../../contexts/LanguageContext';

interface CommitteeListProps {
  groupedMembers: Record<PositionGroupType, CommitteeMember[]>;
  displayOrder: PositionGroupType[];
}

export function CommitteeList({ groupedMembers, displayOrder }: CommitteeListProps) {
  const { t } = useLanguage();

  const getTranslatedTitle = (groupKey: PositionGroupType) => {
    const titleMap: Record<PositionGroupType, string> = {
      'นายกสมาคม': t('committee.president'),
      'กรรมการ': t('committee.board'),
      'เลขาธิการ/เลขานุการ': t('committee.secretary'),
      'ที่ปรึกษา': t('committee.advisor'),
      'ที่ปรึกษากิตติมศักดิ์': t('committee.honoraryAdvisor'),
      'ฝ่ายประชาสัมพันธ์': t('committee.pr')
    };
    return titleMap[groupKey];
  };

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-black">
      <Container>
        <div className="space-y-16 sm:space-y-20 lg:space-y-24">
          {displayOrder.map((groupKey) => (
            groupKey !== 'นายกสมาคม' && (
              <PositionGroup
                key={groupKey}
                title={getTranslatedTitle(groupKey)}
                members={groupedMembers[groupKey] || []}
              />
            )
          ))}
        </div>
      </Container>
    </section>
  );
}