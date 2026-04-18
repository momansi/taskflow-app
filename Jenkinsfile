pipeline{
    agent any
    stages{
        stage('build images'){
            steps{
                sh 'docker build -t muhammadelmansi/taskflow-frontend:latest ./frontend'
                sh 'docker build -t muhammadelmansi/taskflow-backend:latest ./backend'
            }
        }
        stage('push images'){
            steps{
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'pass', usernameVariable: 'user')]) {
                sh 'docker login -u $user -p $pass'
                sh 'docker push muhammadelmansi/taskflow-frontend:latest'
                sh 'docker push muhammadelmansi/taskflow-backend:latest'
                }
            }
        }
        stage('deploy'){
            steps{
                sh 'docker-compose pull'
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
}