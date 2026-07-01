---
id: cpt-simple-interest
no: 2
kind: concept
namespace: concepts
visibility: private
title: 단리
aliases: [단리, 단순 이자, simple interest]
summary: 원금에 대해서만 이자가 붙고 이자에는 이자가 붙지 않는 이자 계산 방식.
edges:
  - rel: contrasts_with
    to: cpt-compound-interest
---

이자를 오직 원금에만 매기는 방식. 각 기간의 이자는 항상 원금 × 금리로
일정하며, 앞선 이자가 다음 이자 계산에 포함되지 않는다.

따라서 잔액은 기간에 대해 **선형**으로 증가한다. 복리처럼 이자가 이자를
낳는 가속 효과가 없어, 같은 금리·기간이면 언제나 복리보다 최종 금액이 작다.
