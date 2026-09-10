#!/usr/bin/env bash
# ⚠ adbles-agents/templates/codespaces/setup-fleet.sh 에서 생성됩니다. 여기서 고치지 마세요.
#
# Codespace 에 함대 에이전트 원본을 받아온다.
# Codespace 가 만들어질 때 한 번, 켜질 때마다 한 번 돈다 — 켜면 항상 최신 원본으로 시작한다.
#
# 여기서 실패해도 Codespace 생성을 막지 않는다. 막으면 사장님이 원인을 볼 화면조차 못 연다.
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
DIR="${AGENTS_DIR:-$ROOT/_agents}"
REPO="${AGENTS_REPO:-playskang-svg/adbles-agents}"

# _agents 는 중앙 저장소 사본이다. 이 저장소에 커밋되면 안 된다.
# .gitignore 가 아니라 .git/info/exclude 에 넣어 사이트 저장소를 더럽히지 않는다.
EXCLUDE="$ROOT/.git/info/exclude"
if [ -f "$EXCLUDE" ] && ! grep -qx "_agents/" "$EXCLUDE"; then echo "_agents/" >> "$EXCLUDE"; fi

echo
echo "▶ 함대 에이전트 원본 — $REPO"
if [ -d "$DIR/.git" ]; then
  if git -C "$DIR" pull -q --ff-only; then
    echo "  ✓ 갱신 ($(git -C "$DIR" log --oneline -1))"
  else
    echo "  ⚠ 갱신 실패 — 기존 사본으로 진행합니다"
  fi
else
  if git clone -q --depth 1 "https://github.com/$REPO.git" "$DIR"; then
    echo "  ✓ 받음 ($(git -C "$DIR" log --oneline -1))"
  else
    echo "  ✖ 받지 못했습니다."
    echo "    Codespace 를 만들 때 '$REPO' 접근 권한 요청을 승인해야 합니다."
    echo "    이 Codespace 를 지우고 새로 만들면서 권한 요청을 승인하세요."
    exit 0
  fi
fi

# 자격증명은 선택이다. 글쓰기·대기열 처리에는 필요 없다 —
# 키워드·순위 재료는 Actions 가 이미 모아 .fleet/state 에 커밋해 둔다.
# Codespaces 시크릿이 있을 때만 주입한다.
if [ -n "${NAVER_AD_API_KEY:-}${GOOGLE_SA_KEY:-}${COUPANG_ACCESS_KEY:-}" ]; then
  node "$DIR/runner/inject-credentials.mjs" >/dev/null 2>&1 && echo "  ✓ Codespaces 시크릿 주입"
fi

if [ -n "${SITE_KEY:-}" ]; then
  node "$DIR/runner/state.mjs" restore --site "$SITE_KEY" 2>/dev/null | sed 's/^/  /'
  node "$DIR/runner/queue.mjs" show --site "$SITE_KEY" 2>/dev/null | sed 's/^/  /'
  node "$DIR/runner/inventory.mjs" list --site "$SITE_KEY" 2>/dev/null | sed 's/^/  /'
fi

echo "  Copilot Chat 에서 에이전트 'fleet' 을 고르고 \"함대 돌려\" 라고 하면 시작합니다."
echo
