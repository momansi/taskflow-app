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
        stage('deploy') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no mansi@192.168.1.10 "
                    cd /home/mansi/DevOps/taskflow-app &&
                    docker compose pull &&
                    docker compose down &&
                    docker compose up -d
                "
                '''
            }
        }
    }
}