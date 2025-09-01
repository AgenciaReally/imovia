// Componente para exibir insights e sugestões do Deepseek AI

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, Target, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AIInsightsProps {
  insights: string[]
  confianca: number
  loading?: boolean
  className?: string
}

export function AIInsights({ insights, confianca, loading = false, className = "" }: AIInsightsProps) {
  if (loading) {
    return (
      <Card className={`border-blue-200 bg-blue-50/50 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <div className="animate-spin">🧠</div>
            <span>IA Analisando...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-blue-200 rounded animate-pulse"></div>
            <div className="h-4 bg-blue-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-blue-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights.length) {
    return null
  }

  const getConfiancaColor = (confianca: number) => {
    if (confianca >= 0.8) return "text-green-600 bg-green-100"
    if (confianca >= 0.6) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const getConfiancaIcon = (confianca: number) => {
    if (confianca >= 0.8) return <TrendingUp className="w-4 h-4" />
    if (confianca >= 0.6) return <Target className="w-4 h-4" />
    return <Brain className="w-4 h-4" />
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 ${className}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Brain className="w-5 h-5" />
                <span>Insights da IA</span>
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={`${getConfiancaColor(confianca)} border-0`}
              >
                <span className="flex items-center gap-1">
                  {getConfiancaIcon(confianca)}
                  {Math.round(confianca * 100)}%
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-blue-100"
              >
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  {insight}
                </p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
