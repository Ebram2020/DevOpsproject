pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                // Clone the repository containing your React app
                git url: 'https://github.com/your-username/your-repo.git', branch: 'dev'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image for the React app
                    sh """
                    docker build -t ali/dashboard:latest playground-dashboard
                    """ // Replace with your Docker Hub username and image name
                }
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub_credit', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh 'docker login -u $USERNAME -p $PASSWORD'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to Docker Hub
                    sh """
                    docker push ali/dashboard:latest
                    """ // Replace with your Docker Hub username and image name
                }
            }
        }
    }

    post {
        success {
            echo 'Docker image built and pushed successfully!'
        }
        failure {
            echo 'Something went wrong!'
        }
    }
}
