// import { autoscalingGroup } from './autoscaling-group';
import { instance } from './instance';

// export const autoscalingGroupArn = autoscalingGroup.then(asg => asg.arn);
export const instanceId = instance.then(i => i.id);