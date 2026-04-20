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
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                sh '''
                    echo "$PASS" | docker login -u "$USER" --password-stdin

                    docker push muhammadelmansi/taskflow-frontend:latest
                    docker push muhammadelmansi/taskflow-backend:latest
                '''
                }
            }
        }
        stage('playbook') {
            steps {
                sh 'ansible-playbook -i ansible/inventory ansible/playbook.yml'
            }
        }
    }
}