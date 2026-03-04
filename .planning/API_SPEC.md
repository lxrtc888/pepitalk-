# API Specification (Draft)

## Base
- Version: `/api/v1`
- Content-Type: `application/json`

## Endpoints

### `POST /scene/enter`
Initialize crowd session context.

Request:
```json
{ "device": "mobile", "locale": "zh-CN" }
```

Response:
```json
{ "sessionId": "uuid", "crowdSeed": "string" }
```

### `POST /characters/select`
Select a moving character and start approach transition.

Request:
```json
{ "sessionId": "uuid", "characterId": "uuid", "tapX": 120, "tapY": 430 }
```

Response:
```json
{ "ok": true, "transition": "approach", "characterId": "uuid" }
```

### `POST /chat/send`
Send user message to selected character.

Request:
```json
{ "characterId": "uuid", "message": "你好，上次你说的展览后来怎么样了？" }
```

Response:
```json
{
  "reply": "我后来真的去了，想起你上次推荐我早点去...",
  "relationshipLevel": "familiar",
  "memoryUsed": true
}
```

### `GET /chat/history?characterId={id}`
Return recent conversation turns for current user and character.

### `POST /chat/exit`
Exit chat mode and return to crowd scene state.

## Error Contract
```json
{
  "error": {
    "code": "MODEL_TIMEOUT",
    "message": "temporary failure",
    "requestId": "uuid"
  }
}
```
