"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconBook,
  IconMessageCircle,
  IconMail,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState } from "react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b last:border-0">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline"
      >
        {question}
        <IconChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>
      {isOpen && (
        <div className="pb-4 pt-0 text-sm text-muted-foreground">{answer}</div>
      )}
    </div>
  );
}

export default function AyudaPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
          Centro de Ayuda
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 text-pretty">
          Encuentra respuestas a las preguntas más frecuentes
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <IconBook className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
            <CardTitle className="text-base sm:text-lg">
              Documentación
            </CardTitle>
            <CardDescription className="text-sm">
              Guías completas sobre todas las funcionalidades
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <IconMessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 mb-2" />
            <CardTitle className="text-base sm:text-lg">Chat en vivo</CardTitle>
            <CardDescription className="text-sm">
              Habla directamente con nuestro equipo a través de WhatsApp +57 312
              345 6721
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <IconMail className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mb-2" />
            <CardTitle className="text-base sm:text-lg">Email</CardTitle>
            <CardDescription className="text-sm">
              soporte@greencontrol.com
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preguntas Frecuentes</CardTitle>
          <CardDescription>Respuestas a las dudas más comunes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            <FAQItem
              question="¿Cómo agrego una nueva parcela?"
              answer="Ve a la sección de Parcelas y haz clic en el botón flotante '+' en la esquina inferior derecha. Completa el formulario con la información de tu parcela y guarda los cambios."
            />
            <FAQItem
              question="¿Cómo configuro las notificaciones?"
              answer="Las notificaciones se generan automáticamente cuando hay alertas importantes en tus parcelas. Puedes marcarlas como leídas desde la sección de Notificaciones."
            />
            <FAQItem
              question="¿Cómo interpreto las analíticas?"
              answer="Las analíticas muestran el rendimiento financiero de cada parcela, incluyendo ingresos, gastos, balance neto y ROI. Los gráficos te ayudan a visualizar la distribución de gastos por categoría."
            />
            <FAQItem
              question="¿Qué hago si detecto un problema técnico?"
              answer="Crea un ticket de soporte desde la sección de Soporte describiendo el problema. Nuestro equipo técnico te responderá en menos de 24 horas."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
