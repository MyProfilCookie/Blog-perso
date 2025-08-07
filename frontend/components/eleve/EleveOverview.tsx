import React from 'react';
import { Card, CardBody, Avatar, Chip } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBookOpen, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { UserInfo, UserStats, getScoreColor, getScoreEmoji } from '../../types/eleve';

interface EleveOverviewProps {
  userStats: UserStats;
  userInfo: UserInfo;
}

const EleveOverview: React.FC<EleveOverviewProps> = ({ userStats, userInfo }) => {
  const scoreColor = getScoreColor(userStats.averageScore);
  const scoreEmoji = getScoreEmoji(userStats.averageScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Profil utilisateur */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardBody className="text-center p-6">
          {userInfo?.avatar ? (
            <Avatar 
              src={userInfo.avatar} 
              className="w-16 h-16 mx-auto mb-4" 
              alt={`${userInfo.prenom} ${userInfo.nom}`}
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="text-4xl text-blue-600 mb-4" />
          )}
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {userInfo?.prenom} {userInfo?.nom}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{userInfo?.email}</p>
          {userStats.subscriptionType && (
            <Chip 
              color="primary" 
              variant="flat" 
              className="mt-2"
            >
              {userStats.subscriptionType}
            </Chip>
          )}
        </CardBody>
      </Card>

      {/* Exercices complétés */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardBody className="text-center p-6">
          <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {userStats.totalExercises}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Exercices complétés</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {userStats.totalCorrect} réussites
          </p>
        </CardBody>
      </Card>

      {/* Score moyen */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardBody className="text-center p-6">
          <div className="text-4xl mb-4">{scoreEmoji}</div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {userStats.averageScore.toFixed(1)}%
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Score moyen</p>
          <Chip 
             color={scoreColor} 
             variant="flat" 
             className="mt-2"
           >
             {userStats.averageScore >= 90 ? 'Excellent' : 
              userStats.averageScore >= 70 ? 'Bien' : 
              userStats.averageScore >= 50 ? 'Moyen' : 'À améliorer'}
           </Chip>
        </CardBody>
      </Card>
    </div>
  );
};

EleveOverview.displayName = 'EleveOverview';

export default EleveOverview;