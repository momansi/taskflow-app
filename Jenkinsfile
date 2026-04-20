pipeline{
    agent any
    stages{
        stage('build images'){
            steps{
                sh 'docker build -t muhammadelmansi/taskflow-frontend:${BUILD_NUMBER} ./frontend'
                sh 'docker build -t muhammadelmansi/taskflow-backend:${BUILD_NUMBER} ./backend'
            }
        }
        stage('push images'){
            steps{
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                sh '''
                    echo "$PASS" | docker login -u "$USER" --password-stdin

                    docker push muhammadelmansi/taskflow-frontend:${BUILD_NUMBER}
                    docker push muhammadelmansi/taskflow-backend:${BUILD_NUMBER}
                '''
                }
            }
        }
        stage('playbook') {
            steps {
                sh """  
                ansible-playbook -i ansible/inventory ansible/playbook.yml \
                -e image_tag=${BUILD_NUMBER}
                """
            }
        }
    }
}