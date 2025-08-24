# クエストAPI仕様書
| No | エンドポイント                    | メソッド | 説明                 | リクエストパラメータ              | レスポンス形式 | レスポンス例                                                         | 認証              | エラーコード        |
|----|----------------------------|------|--------------------|-------------------------|---------|----------------------------------------------------------------|-----------------|---------------|
| 1  | /api/v1/quests/available   | GET  | 応募可能なクエスト一覧を取得     | なし                      | JSON    | {"status": "available", "quests": [{...}], "total_count": 10}  | 不要（user_id=1固定） | 200, 500      |
| 2  | /api/v1/quests/in-progress | GET  | 進行中のクエスト一覧を取得      | なし                      | JSON    | {"status": "in_progress", "quests": [{...}], "total_count": 5} | 不要（user_id=1固定） | 200, 500      |
| 3  | /api/v1/quests/upcoming    | GET  | まもなく解放されるクエスト一覧を取得 | なし                      | JSON    | {"status": "upcoming", "quests": [{...}], "total_count": 3}    | 不要（user_id=1固定） | 200, 500      |
| 4  | /api/v1/quests/{quest_id}  | GET  | クエスト詳細情報を取得        | quest_id: int (パスパラメータ) | JSON    | {"id": 7, "title": "...", "skills": [...], "benefits": [...]}  | 不要（user_id=1固定） | 200, 404, 500 |
| 5  | /api/v1/quests/apply       | POST | クエストに応募            | {"quest_id": int}       | JSON    | {"success": true, "message": "応募が完了しました"}                      | 不要（user_id=1固定） | 200, 400, 500 |
| 6 | /api/v1/quests/v2/available   | GET | 応募可能なクエスト一覧を取得（v2）     | なし | JSON | {"status": "available", "quests": [{...}], "total_count": 10}  | 不要（user_id=1固定） | 200, 500 |
| 7 | /api/v1/quests/v2/in-progress | GET | 進行中のクエスト一覧を取得（v2）      | なし | JSON | {"status": "in_progress", "quests": [{...}], "total_count": 5} | 不要（user_id=1固定） | 200, 500 |
| 8 | /api/v1/quests/v2/upcoming    | GET | まもなく解放されるクエスト一覧を取得（v2） | なし | JSON | {"status": "upcoming", "quests": [{...}], "total_count": 3}    | 不要（user_id=1固定） | 200, 500 |
| 9  | /api/v1/study/dashboard | GET | 学習ダッシュボード情報を取得 | なし | JSON | {"goal": {"current_score": 967, "next_goal_score": 1000, "progress_percent": 34, "remaining_percent": 66, "remaining_text": "次のゴールまであと66%"}, "ongoing": [{"id": 4, "title": "Webサイト制作入門", "progress_percent": 38}], "recommended": [{"id": 3, "title": "JavaScriptで作る動くWebページ", "total_score": 123}]} | 不要（user_id=1固定） | 200, 500 |
| 10 | /api/v1/study/contents  | GET | 学習コンテンツ一覧を取得   | なし | JSON | [{"id": 1, "title": "ゼロから始めるWebサイト制作", "description": "...", "cover_image_url": null, "provider_name": "Progate", "difficulty_level": 2, "total_score": 60}]                                                                                                                                          | 不要（user_id=1固定） | 200, 500 |

# レスポンスフィールド詳細（クエスト一覧共通）
| フィールド名               | 型           | 説明                            |
|----------------------|-------------|-------------------------------|
| id                   | int         | クエストID                        |
| title                | string      | タイトル                          |
| objective            | string      | 目的                            |
| description          | string      | 説明                            |
| difficulty_level     | int         | 難易度レベル(1-5)                   |
| provider_name        | string      | 提供団体名                         |
| duration_display     | string      | 期間表示（例："2ヶ月"）                 |
| deadline             | date/null   | 締切日                           |
| participants_display | string      | 参加者数表示（例："4名"）                |
| points_display       | string      | ポイント表示（例："+100"）              |
| match_rate           | int         | マッチ度（%）                       |
| is_urgent            | boolean     | 締切間近フラグ                       |
| can_apply            | boolean     | 応募可能フラグ                       |
| user_status          | string/null | ユーザーの状態                       |
| quest_type           | string      | クエスト種別（"quest"/"benefit_use"） |
| score_diff           | int/null    | 必要スコアまでの差分（upcomingのみ）        |
| unlock_message       | string/null | 解放メッセージ（upcomingのみ）           |