-- Limpar duplicatas mantendo apenas a resposta mais recente de cada userId+perguntaId
WITH duplicates_to_keep AS (
  SELECT DISTINCT ON ("userId", "perguntaId") 
    "id", "userId", "perguntaId", "updatedAt"
  FROM "Resposta"
  ORDER BY "userId", "perguntaId", "updatedAt" DESC
)
DELETE FROM "Resposta" 
WHERE "id" NOT IN (SELECT "id" FROM duplicates_to_keep);

-- Verificar se ainda há duplicatas
SELECT "userId", "perguntaId", COUNT(*) as count
FROM "Resposta"
GROUP BY "userId", "perguntaId"
HAVING COUNT(*) > 1;
