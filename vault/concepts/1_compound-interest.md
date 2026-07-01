---
id: cpt-compound-interest       # infinite-brain 원본의 안정적 식별자 (샘플용, 불변)
no: 1                           # kim-1 store 내 전역 순번 (불변)
kind: concept
namespace: concepts
visibility: private             # 한번 정하면 불변 (edge 이름 안 깨지게)
title: 복리
aliases: [복리, 복리 이자, 이자에 이자, compound interest]   # 전문검색 recall용 앵커
summary: 원금뿐 아니라 누적된 이자에도 다시 이자가 붙는 이자 계산 방식.
edges:
  - rel: contrasts_with
    to: cpt-simple-interest      # 단리 (concept) — sync 시 no·전체이름으로 해석
  - rel: defined_by
    to: fct-compound-formula     # 복리 공식 (fact)
---

원금에 대해서만 이자가 붙는 단리와 달리, 복리는 각 기간마다 발생한
이자를 원금에 합산한 뒤 그 합계에 다음 이자를 매긴다. 그래서 시간이
지날수록 이자가 이자를 낳아 잔액이 기하급수적으로 늘어난다.

핵심은 **복리 주기(연/월/일 복리)**와 **기간**이다. 같은 명목 금리라도
복리 주기가 짧을수록, 기간이 길수록 최종 금액이 커진다. 장기 저축·투자에서
결정적으로 작용하는 이유가 이것이다.
