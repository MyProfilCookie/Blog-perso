"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { Copy, Download, Eye, EyeOff, Code } from "lucide-react";
import { toast } from "sonner";

interface ArticleDataViewerProps {
  articleData: any;
  articleId: string;
}

const ArticleDataViewer: React.FC<ArticleDataViewerProps> = ({
  articleData,
  articleId,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(articleData, null, 2));
      toast.success("Données copiées dans le presse-papiers ! 📋");
    } catch (err) {
      toast.error("Erreur lors de la copie");
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(articleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `article-${articleId}-data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Fichier JSON téléchargé ! 📥");
  };

  const formatJSON = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  if (!articleData) {
    return null;
  }

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Données techniques de l'article
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="light"
              color="default"
              startContent={isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? "Masquer" : "Afficher"}
            </Button>
          </div>
        </div>

        {isVisible && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                color="primary"
                variant="flat"
                startContent={<Copy className="w-4 h-4" />}
                onClick={copyToClipboard}
              >
                Copier JSON
              </Button>
              <Button
                size="sm"
                color="secondary"
                variant="flat"
                startContent={<Download className="w-4 h-4" />}
                onClick={downloadJSON}
              >
                Télécharger
              </Button>
              <Button
                size="sm"
                variant="light"
                color="default"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Réduire" : "Développer"}
              </Button>
            </div>

            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-hidden">
              <pre
                className={`text-green-400 dark:text-green-300 font-mono text-sm leading-relaxed whitespace-pre-wrap ${
                  isExpanded ? "max-h-none" : "max-h-96 overflow-y-auto"
                }`}
              >
                {formatJSON(articleData)}
              </pre>
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="font-medium mb-1">💡 Informations utiles :</p>
              <ul className="space-y-1">
                <li>• <strong>ID de l'article :</strong> {articleData._id || articleData.id}</li>
                <li>• <strong>Nombre de champs :</strong> {Object.keys(articleData).length}</li>
                <li>• <strong>Source :</strong> Base de données MongoDB</li>
                <li>• <strong>Format :</strong> JSON structuré</li>
              </ul>
            </div>
          </div>
        )}

        {!isVisible && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Cliquez sur "Afficher" pour voir les données techniques de cet article
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ArticleDataViewer;
