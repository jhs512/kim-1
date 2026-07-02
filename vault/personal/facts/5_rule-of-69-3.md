---
id: fact-rule-of-69-3
no: 5
title: 69.3법칙
type: fact
namespace: personal
visibility: public
summary: 연속복리에서 원금이 2배 되는 시간은 69.3 ÷ 연이율(%)로, 72법칙보다 정확하다.
auto_inject: false
applicable_when: "Empty"
confidence: 0.9
verified_at: "Empty"
verified_by: "Empty"
staleness_signal: 이 근사식이 표준 수학 정의와 어긋나면 재검토한다
tags: ["finance", "interest", "heuristic", "rule-of-69"]
edges: [
  {"target": "fact-rule-of-72", "type": "related_to", "weight": 0.8, "note": "암산 편의를 위해 72를 쓰지만, 연속복리엔 69.3이 더 정확한 변형"},
  {"target": "concept-compound-interest", "type": "derived_from", "weight": 0.8, "note": "연속복리 공식 A=P·e^(rt)에서 유도"}
]
related: ["[[fact-rule-of-72]]", "[[concept-compound-interest]]"]
source_url: "Empty"
---

원금이 두 배가 되는 데 걸리는 시간을 암산할 때, 72법칙(72 ÷ 이율)이 흔히 쓰이지만
**연속복리**에서는 **69.3법칙**(69.3 ÷ 연이율%)이 더 정확하다.

근거는 자연로그다. 연속복리 A = P·e^(rt)에서 2배가 되는 조건은 e^(rt)=2, 즉
r·t = ln(2) ≈ 0.693. 그래서 t = 69.3 / (이율%)가 된다. 72는 나눗셈이 쉬운 값(2·3·4·6·8·9의
약수)이라 실무 암산에 편해 관습적으로 쓰인다.
