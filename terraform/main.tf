provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

resource "aws_vpc" "main_vpc" {
  cidr_block = var.vpc_cider_block

  tags = {
    Name = var.vpc_name
  }
}

# Create internet gateway
resource "aws_internet_gateway" "main_gateway" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = var.gateway_name
  }
}

# Create two public subnets in different AZs
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = var.subnet1_cider_block
  availability_zone       = var.subnet1_AZ
  map_public_ip_on_launch = true

  tags = {
    Name = var.subnet1_name
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = var.subnet2_cider_block
  availability_zone       = var.subnet2_AZ
  map_public_ip_on_launch = true

  tags = {
    Name = var.subnet2_name
  }
}

# Create route table for public subnets
resource "aws_route_table" "route_table_public_subnet" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = var.route_table_cider_block
    gateway_id = aws_internet_gateway.main_gateway.id
  }

  tags = {
    Name = var.route_table_name
  }
}

resource "aws_route_table_association" "public_association_a" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.route_table_public_subnet.id
}

resource "aws_route_table_association" "public_association_b" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.route_table_public_subnet.id
}

resource "aws_security_group" "jenkins_sg" {
  vpc_id = aws_vpc.main_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow SSH access from anywhere (not recommended for production)
  }


  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # Allow all outbound traffic
  }

  tags = {
    Name = "jenkins_sg"
  }
}

resource "aws_instance" "jenkins" {
  ami                    = var.jenkins_es2_ami
  instance_type          = var.jenkins_es2_type
  subnet_id              = aws_subnet.public_subnet_1.id
  availability_zone      = var.jenkins_es2_AZ
  key_name               = var.jenkins_es2_key
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]

  tags = {
    Name = var.jenkins_es2_name
  }
}


output "jenkins_ip" {
  value       = aws_instance.jenkins.public_ip
  description = "The public IP address of the Jenkins EC2 instance."
}

# Security Group for EKS
# resource "aws_security_group" "eks_sg" {
#   vpc_id = aws_vpc.main_vpc.id

#   ingress {
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "EKS_Security_Group"
#   }
# }

# # IAM Role for EKS Cluster
# resource "aws_iam_role" "eks_cluster_role" {
#   name = "eks_cluster_role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Effect = "Allow"
#         Principal = {
#           Service = "eks.amazonaws.com"
#         }
#       }
#     ]
#   })
# }

# # Attach the necessary policy to the EKS cluster role
# resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSClusterPolicy" {
#   policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
#   role       = aws_iam_role.eks_cluster_role.name
# }

# # EKS Cluster
# resource "aws_eks_cluster" "my_eks_cluster" {
#   name     = "Dashboard_cluster"
#   role_arn = aws_iam_role.eks_cluster_role.arn

#   vpc_config {
#     subnet_ids = [
#       aws_subnet.public_subnet_1.id,
#       aws_subnet.public_subnet_2.id,
#     ]
#   }

#   depends_on = [aws_iam_role_policy_attachment.eks_cluster_AmazonEKSClusterPolicy]
# }

# # IAM Role for EKS Worker Nodes
# resource "aws_iam_role" "eks_worker_role" {
#   name = "eks-worker-role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:AssumeRole"
#         Effect = "Allow"
#         Principal = {
#           Service = "ec2.amazonaws.com"
#         }
#       }
#     ]
#   })
# }

# # Attach necessary policies to the EKS worker node role
# resource "aws_iam_role_policy_attachment" "eks_worker_AmazonEKSWorkerNodePolicy" {
#   policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
#   role       = aws_iam_role.eks_worker_role.name
# }

# resource "aws_iam_role_policy_attachment" "eks_worker_AmazonEC2ContainerRegistryReadOnly" {
#   policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
#   role       = aws_iam_role.eks_worker_role.name
# }

# # EKS Node Group
# resource "aws_eks_node_group" "eks_node_group" {
#   cluster_name    = aws_eks_cluster.my_eks_cluster.name
#   node_group_name = "my-node-group"
#   node_role_arn   = aws_iam_role.eks_worker_role.arn
#   subnet_ids      = [
#     aws_subnet.public_subnet_1.id,
#     aws_subnet.public_subnet_2.id,
#   ]

#   scaling_config {
#     desired_size = 1
#     max_size     = 1
#     min_size     = 1
#   }

#   instance_types = ["t3.micro"] # Free tier eligible

#   tags = {
#     Name = "eks-worker"
#   }

#   depends_on = [aws_iam_role_policy_attachment.eks_worker_AmazonEKSWorkerNodePolicy]
# }
