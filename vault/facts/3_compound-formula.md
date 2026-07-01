---
id: fct-compound-formula
no: 3
kind: fact
namespace: facts
visibility: private
title: 복리 공식
aliases: [복리 공식, 복리 계산식, 미래가치 공식, A = P(1+r/n)^(nt)]
summary: 복리 미래가치는 A = P(1 + r/n)^(nt) 로 계산한다.
edges:
  - rel: defines
    to: cpt-compound-interest
---

복리로 불어난 최종 금액(미래가치)은 다음으로 구한다:

    A = P (1 + r/n)^(n·t)

- P: 원금
- r: 연 명목 금리 (소수)
- n: 연간 복리 횟수 (연 1, 월 12, 일 365)
- t: 기간(년)
- A: t년 후 최종 금액

n을 키우면(복리 주기 단축) 같은 r·t에서도 A가 커지며, n→∞ 극한은
연속복리 A = P·e^(rt) 로 수렴한다.
